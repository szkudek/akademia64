import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, randomUUID, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const scrypt = promisify(scryptCallback);
const SESSION_SECONDS = 7 * 24 * 60 * 60;
const DEFAULT_ROOT = fileURLToPath(new URL('../dist/', import.meta.url));
const hash = value => createHash('sha256').update(value).digest('hex');
const emptyProgress = () => ({ done: [], solved: [], days: [], games: 0 });
const lessonIds = new Set([3,4,3,4,3,2].flatMap((count,i)=>Array.from({length:count},(_,j)=>`${i}-${j}`)));
const puzzleIds = new Set(['mate1','hanging','backrank','forkreal','promotion','bishop']);
const PASSWORD_OPTIONS = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
class HttpError extends Error { constructor(status,message) { super(message); this.status=status; } }
function validatePassword(password) {
  if (typeof password !== 'string' || [...password].length < 12 || Buffer.byteLength(password) > 256)
    throw new HttpError(400,'Hasło musi mieć co najmniej 12 znaków i nie więcej niż 256 bajtów.');
}
function emailValue(value) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400,'Podaj poprawny adres e-mail.');
  return email;
}
function normalizeProgress(value) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.done) || !Array.isArray(value.solved) || !Array.isArray(value.days)) throw new HttpError(400,'Niepoprawne dane postępów.');
  if (value.done.length>50 || value.solved.length>50 || value.days.length>5000 || !Number.isSafeInteger(value.games) || value.games<0 || value.games>1000000) throw new HttpError(400,'Niepoprawne dane postępów.');
  return {
    done:[...new Set(value.done.filter(id=>lessonIds.has(id)))],
    solved:[...new Set(value.solved.filter(id=>puzzleIds.has(id)))],
    days:[...new Set(value.days.filter(day=>typeof day==='string' && /^\d{4}-\d{2}-\d{2}$/.test(day)))].sort(),
    games:value.games
  };
}
function mergeProgress(a,b) {
  return normalizeProgress({done:[...new Set([...a.done,...b.done])],solved:[...new Set([...a.solved,...b.solved])],days:[...new Set([...a.days,...b.days])],games:Math.max(a.games,b.games)});
}
async function body(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) throw new HttpError(415,'Wymagane dane JSON.');
  let length=0; const chunks=[];
  for await (const chunk of req) { length+=chunk.length; if(length>64*1024) throw new HttpError(413,'Zbyt duża ilość danych.'); chunks.push(chunk); }
  try { const value=JSON.parse(Buffer.concat(chunks).toString()); if(!value||typeof value!=='object'||Array.isArray(value))throw Error(); return value; }
  catch { throw new HttpError(400,'Niepoprawny format danych.'); }
}

export async function createApp({dbPath,staticRoot=DEFAULT_ROOT,origin=null,production=false,now=Date.now}={}) {
  if (production && (!origin || new URL(origin).protocol!=='https:')) throw new Error('W trybie produkcyjnym ustaw APP_ORIGIN z adresem HTTPS.');
  if (!dbPath) dbPath=resolve('data/academy.sqlite');
  if (dbPath!==':memory:') await mkdir(dirname(dbPath),{recursive:true,mode:0o700});
  const db=new DatabaseSync(dbPath);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT NOT NULL UNIQUE,name TEXT NOT NULL,password_hash TEXT NOT NULL,salt TEXT NOT NULL,recovery_hash TEXT NOT NULL,created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS progress(user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL);`);
  let activeHashes=0;
  async function passwordHash(password,salt) {
    if(activeHashes>=2) throw new HttpError(503,'Serwer jest zajęty. Spróbuj ponownie za chwilę.');
    activeHashes++; try { return await scrypt(password,salt,64,PASSWORD_OPTIONS); } finally { activeHashes--; }
  }
  function limit(key,max,seconds) {
    const t=now(); const k=hash(key); const row=db.prepare('SELECT count,expires_at FROM attempts WHERE key=?').get(k);
    if(row && row.expires_at>t && row.count>=max) throw new HttpError(429,'Zbyt wiele prób. Odczekaj kilkanaście minut i spróbuj ponownie.');
    db.prepare('INSERT INTO attempts(key,count,expires_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,expires_at=excluded.expires_at').run(k,row&&row.expires_at>t?row.count+1:1,row&&row.expires_at>t?row.expires_at:t+seconds*1000);
    db.prepare('DELETE FROM attempts WHERE expires_at<?').run(t);
  }
  const cookieName=production?'__Host-akademia64':'akademia64_session';
  function setSession(res,userId,oldToken) {
    if(oldToken)db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(oldToken));
    const token=randomBytes(32).toString('base64url');
    db.prepare('DELETE FROM sessions WHERE expires_at<?').run(now());
    db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)').run(hash(token),userId,now()+SESSION_SECONDS*1000);
    res.setHeader('Set-Cookie',`${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${production?'; Secure':''}`);
  }
  function tokenFrom(req) {return (req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';}
  function currentUser(req) {
    const token=tokenFrom(req); if(!token||token.length>128)return null;
    return db.prepare('SELECT users.id,users.email,users.name FROM sessions JOIN users ON users.id=sessions.user_id WHERE token_hash=? AND expires_at>?').get(hash(token),now())||null;
  }
  function getProgress(id) {const row=db.prepare('SELECT data FROM progress WHERE user_id=?').get(id);return row?JSON.parse(row.data):emptyProgress();}
  function json(res,status,data) {res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
  const server=createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','same-origin');
    res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    try {
      const url=new URL(req.url,'http://localhost');
      if(!production&&!origin){const host=new URL(`http://${req.headers.host}`).hostname;if(!['localhost','127.0.0.1','[::1]'].includes(host))throw new HttpError(403,'Niedozwolony adres lokalnego serwera.');}
      if(url.pathname.startsWith('/api/')) {
        res.setHeader('Cache-Control','no-store');
        const method=req.method; const path=url.pathname;
        if(!['GET','POST','PUT'].includes(method))throw new HttpError(405,'Ta operacja nie jest obsługiwana.');
        if(method!=='GET') {
          const expected=origin||`http://${req.headers.host}`;
          if(req.headers.origin!==expected || req.headers['sec-fetch-site']==='cross-site' || req.headers['x-requested-with']!=='Akademia64')throw new HttpError(403,'Nie udało się potwierdzić źródła żądania. Odśwież stronę.');
        }
        const ip=req.socket.remoteAddress||'unknown';
        if(method==='GET'&&path==='/api/session')return json(res,200,{user:currentUser(req),features:{accounts:true,recovery:'code'}});
        if(method==='POST'&&['/api/register','/api/login','/api/reset-password'].includes(path)) {
          limit(`auth-ip:${ip}`,40,900);
          const data=await body(req);const email=emailValue(data.email);
          limit(`${path}:email:${email}`,12,900);
          if(path==='/api/register') {
            limit(`register:${ip}`,5,3600);validatePassword(data.password);
            const name=typeof data.name==='string'?data.name.trim():'';
            if(name.length<2 || [...name].length>40 || /[\x00-\x1f]/.test(name))throw new HttpError(400,'Nazwa musi mieć od 2 do 40 znaków.');
            const salt=randomBytes(16).toString('hex');const passwordDigest=(await passwordHash(data.password,salt)).toString('hex');
            const recoveryCode=randomBytes(24).toString('hex').match(/.{1,8}/g).join('-');
            const user={id:randomUUID(),email,name};
            try{db.prepare('INSERT INTO users(id,email,name,password_hash,salt,recovery_hash,created_at) VALUES(?,?,?,?,?,?,?)').run(user.id,email,name,passwordDigest,salt,hash(recoveryCode),now());}
            catch(error){if(db.prepare('SELECT id FROM users WHERE email=?').get(email))throw new HttpError(409,'Nie można utworzyć konta z tym adresem. Spróbuj się zalogować lub odzyskać dostęp.');throw error;}
            setSession(res,user.id,tokenFrom(req));return json(res,201,{user,recoveryCode});
          }
          const row=db.prepare('SELECT * FROM users WHERE email=?').get(email);
          if(path==='/api/login') {
            if(typeof data.password!=='string'||Buffer.byteLength(data.password)>256)throw new HttpError(400,'Niepoprawny e-mail lub hasło.');
            const digest=await passwordHash(data.password,row?.salt||'00000000000000000000000000000000');
            const stored=row?Buffer.from(row.password_hash,'hex'):Buffer.alloc(64);
            if(!timingSafeEqual(digest,stored)||!row)throw new HttpError(401,'Niepoprawny e-mail lub hasło.');
            const user={id:row.id,email:row.email,name:row.name};setSession(res,user.id,tokenFrom(req));return json(res,200,{user});
          }
          validatePassword(data.password);
          const code=typeof data.recoveryCode==='string'?data.recoveryCode.trim().toLowerCase():'';
          if(code.length>100)throw new HttpError(400,'Niepoprawny e-mail lub kod odzyskiwania.');
          const valid=timingSafeEqual(Buffer.from(hash(code),'hex'),Buffer.from(row?.recovery_hash||'0'.repeat(64),'hex'));
          if(!valid||!row)throw new HttpError(400,'Niepoprawny e-mail lub kod odzyskiwania.');
          const salt=randomBytes(16).toString('hex');const digest=(await passwordHash(data.password,salt)).toString('hex');
          const recoveryCode=randomBytes(24).toString('hex').match(/.{1,8}/g).join('-');
          // A reset invalidates every prior session and consumes the recovery code once.
          db.exec('BEGIN IMMEDIATE');
          try {
            const changed=db.prepare('UPDATE users SET password_hash=?,salt=?,recovery_hash=? WHERE id=? AND recovery_hash=?').run(digest,salt,hash(recoveryCode),row.id,row.recovery_hash);
            if(changed.changes!==1)throw new HttpError(400,'Kod został już wykorzystany.');
            db.prepare('DELETE FROM sessions WHERE user_id=?').run(row.id);db.exec('COMMIT');
          }catch(error){db.exec('ROLLBACK');throw error;}
          return json(res,200,{recoveryCode});
        }
        if(method==='POST'&&path==='/api/logout') {
          const active=currentUser(req);
          if(active && req.headers['x-academy-user'] && req.headers['x-academy-user']!==active.id)throw new HttpError(409,'Konto zmieniło się w innej karcie. Odśwież stronę.');
          await body(req);db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hash(tokenFrom(req)));
          res.setHeader('Set-Cookie',`${cookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${production?'; Secure':''}`);return json(res,200,{ok:true});
        }
        const user=currentUser(req);if(!user)throw new HttpError(401,'Zaloguj się ponownie, aby zapisać postępy.');
        if(path==='/api/progress' && req.headers['x-academy-user'] && req.headers['x-academy-user']!==user.id)throw new HttpError(409,'Konto zmieniło się w innej karcie. Odśwież stronę.');
        if(path==='/api/progress'&&method==='GET')return json(res,200,{progress:getProgress(user.id)});
        if(path==='/api/progress'&&method==='PUT') {
          const incoming=normalizeProgress(await body(req));const progress=mergeProgress(getProgress(user.id),incoming);
          db.prepare('INSERT INTO progress(user_id,data) VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data').run(user.id,JSON.stringify(progress));
          return json(res,200,{progress});
        }
        throw new HttpError(404,'Nie znaleziono tej operacji.');
      }
      if(!['GET','HEAD'].includes(req.method))throw new HttpError(405,'Ta operacja nie jest obsługiwana.');
      let path;try{path=decodeURIComponent(url.pathname)}catch{throw new HttpError(400,'Niepoprawny adres.');}
      if(path.split('/').some(p=>p.startsWith('.'))||path.includes('\\'))throw new HttpError(404,'Nie znaleziono strony.');
      const root=resolve(staticRoot);const target=resolve(root,'.'+(path==='/'?'/index.html':path));
      if(!target.startsWith(root+sep))throw new HttpError(404,'Nie znaleziono strony.');
      let bytes;try{if(!(await stat(target)).isFile())throw Error();bytes=await readFile(target);}catch{throw new HttpError(404,'Nie znaleziono strony.');}
      const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
      res.writeHead(200,{'Content-Type':types[extname(target)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:bytes);
    }catch(error){if(!res.headersSent)json(res,error.status||500,{error:error.status?error.message:'Wystąpił błąd serwera. Spróbuj ponownie.'});else res.end();}
  });
  server.requestTimeout=15000;server.headersTimeout=10000;
  return {server,close:async()=>{await new Promise((r,j)=>server.close(e=>e?j(e):r()));db.close();}};
}
