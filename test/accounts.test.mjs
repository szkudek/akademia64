import { request as httpRequest } from 'node:http';
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp,rm,readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server/app.mjs';

async function fixture(t,{disk=false,production=false}={}) {
 const dir=await mkdtemp(join(tmpdir(),'akademia64-test-'));
 const app=await createApp({dbPath:disk?join(dir,'accounts.sqlite'):':memory:',production,origin:production?'https://academy.example':null});
 await new Promise(r=>app.server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${app.server.address().port}`;
 t.after(async()=>{await app.close();await rm(dir,{recursive:true,force:true})});
 async function request(path,{method='GET',data,cookie,origin=production?'https://academy.example':base,headers={}}={}){
  const response=await fetch(base+path,{method,headers:{...(cookie?{cookie}:{}),...(method!=='GET'?{'Content-Type':'application/json','Origin':origin,'X-Requested-With':'Akademia64'}:{}),...headers},...(data!==undefined?{body:JSON.stringify(data)}:{})});
  let result;try{result=await response.json()}catch{result=null}
  return {status:response.status,data:result,cookie:response.headers.get('set-cookie')?.split(';')[0],headers:response.headers};
 }
 return {request,app,dir,base};
}
const credentials=(email='learner@example.test')=>({name:'Szachista',email,password:'Testowa długa fraza 2026'});
const progress={done:['0-0'],solved:['mate1'],days:['2026-11-02'],games:1};

test('accounts: registration, cookies, session restore, isolation, merge, logout and password login',async t=>{
 const {request}=await fixture(t);
 const first=await request('/api/register',{method:'POST',data:credentials()});
 assert.equal(first.status,201);
 assert.equal((await request('/api/register',{method:'POST',data:credentials()})).status,409);
 assert.ok(first.data.recoveryCode);assert.ok(!('password_hash' in first.data.user));
 assert.match(first.headers.get('set-cookie'),/HttpOnly/);assert.match(first.headers.get('set-cookie'),/SameSite=Strict/);
 assert.equal((await request('/api/session',{cookie:first.cookie})).data.user.email,'learner@example.test');
 assert.equal((await request('/api/progress',{method:'PUT',cookie:first.cookie,data:progress})).status,200);
 const second=await request('/api/register',{method:'POST',data:credentials('second@example.test')});
 assert.equal(second.status,201);
 assert.equal((await request('/api/progress',{method:'PUT',cookie:second.cookie,data:progress,headers:{'X-Academy-User':first.data.user.id}})).status,409);
 assert.equal((await request('/api/logout',{method:'POST',cookie:second.cookie,data:{},headers:{'X-Academy-User':first.data.user.id}})).status,409);
 assert.deepEqual((await request('/api/progress',{cookie:second.cookie})).data.progress,{done:[],solved:[],days:[],games:0});
 const merged=await request('/api/progress',{method:'PUT',cookie:first.cookie,data:{...progress,done:['0-1'],solved:[]}});
 assert.deepEqual(new Set(merged.data.progress.done),new Set(['0-0','0-1']));assert.deepEqual(merged.data.progress.solved,['mate1']);
 await request('/api/logout',{method:'POST',cookie:first.cookie,data:{}});
 assert.equal((await request('/api/progress',{cookie:first.cookie})).status,401);
 assert.equal((await request('/api/login',{method:'POST',data:{email:'learner@example.test',password:'zlehaslo'}})).status,401);
 const login=await request('/api/login',{method:'POST',data:credentials()});assert.equal(login.status,200);assert.notEqual(login.cookie,first.cookie);
 assert.equal((await request('/api/progress',{cookie:login.cookie})).data.progress.done.length,2);
});

test('reset consumes the recovery code, invalidates all sessions and changes the password',async t=>{
 const {request}=await fixture(t);
 const register=await request('/api/register',{method:'POST',data:credentials()});
 const login=await request('/api/login',{method:'POST',data:credentials()});
 const data={email:credentials().email,password:'Nowa bezpieczna fraza 2026',recoveryCode:register.data.recoveryCode};
 assert.equal((await request('/api/reset-password',{method:'POST',data:{...data,recoveryCode:'incorrect'}})).status,400);
 const reset=await request('/api/reset-password',{method:'POST',data});assert.equal(reset.status,200);assert.notEqual(reset.data.recoveryCode,data.recoveryCode);
 assert.equal((await request('/api/progress',{cookie:register.cookie})).status,401);assert.equal((await request('/api/progress',{cookie:login.cookie})).status,401);
 assert.equal((await request('/api/reset-password',{method:'POST',data})).status,400);
 assert.equal((await request('/api/login',{method:'POST',data:credentials()})).status,401);
 assert.equal((await request('/api/login',{method:'POST',data:{email:data.email,password:data.password}})).status,200);
});

test('validates input, denies cross-origin writes, prevents SQL injection and rate limits attacks',async t=>{
 const {request,base}=await fixture(t);
 assert.equal((await request('/api/register',{method:'POST',data:credentials(),origin:'https://attacker.example'})).status,403);
 const rejectedHost=await new Promise((resolve,reject)=>{const req=httpRequest(base+'/api/session',{headers:{Host:'attacker.example'}},res=>{res.resume();resolve(res.statusCode)});req.on('error',reject);req.end()});
 assert.equal(rejectedHost,403);
 assert.equal((await request('/api/register',{method:'POST',data:{...credentials(),password:'short'}})).status,400);
 assert.equal((await request('/api/register',{method:'POST',data:{...credentials(),email:'no-email'}})).status,400);
 assert.equal((await request('/api/login',{method:'POST',data:{email:"'OR'1'='1@example.test",password:'irrelevant'}})).status,401);
 for(let i=0;i<12;i++)assert.equal((await request('/api/login',{method:'POST',data:credentials('missing@example.test')})).status,401);
 assert.equal((await request('/api/login',{method:'POST',data:credentials('missing@example.test')})).status,429);
});

test('stores no plaintext passwords, serves only public assets and production cookies are Secure',async t=>{
 const {request,dir}=await fixture(t,{disk:true,production:true});
 const register=await request('/api/register',{method:'POST',data:credentials()});assert.equal(register.status,201);assert.match(register.headers.get('set-cookie'),/; Secure/);assert.match(register.cookie,/^__Host-/);
 for(const file of ['accounts.sqlite','accounts.sqlite-wal']){const bytes=await readFile(join(dir,file)).catch(()=>Buffer.alloc(0));assert.ok(!bytes.includes(Buffer.from(credentials().password)));assert.ok(!bytes.includes(Buffer.from(register.data.recoveryCode)))}
 assert.equal((await request('/data/accounts.sqlite')).status,404);assert.equal((await request('/server/app.mjs')).status,404);
 assert.equal((await request('/api/progress',{method:'PUT',cookie:register.cookie,data:{done:'wrong'}})).status,400);
 const local=await fixture(t);const response=await fetch(local.base+'/');assert.equal(response.status,200);assert.match(await response.text(),/account-button/);
});

test('account and progress persist after server restart',async t=>{
 const dir=await mkdtemp(join(tmpdir(),'akademia64-persist-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const dbPath=join(dir,'academy.sqlite');let app=await createApp({dbPath});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));
 let base=`http://127.0.0.1:${app.server.address().port}`;
 const response=await fetch(base+'/api/register',{method:'POST',headers:{Origin:base,'Content-Type':'application/json','X-Requested-With':'Akademia64'},body:JSON.stringify(credentials())});const cookie=response.headers.get('set-cookie').split(';')[0];
 await fetch(base+'/api/progress',{method:'PUT',headers:{Origin:base,'Content-Type':'application/json','X-Requested-With':'Akademia64',Cookie:cookie},body:JSON.stringify(progress)});
 await app.close();app=await createApp({dbPath});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));base=`http://127.0.0.1:${app.server.address().port}`;
 t.after(()=>app.close());const persisted=await fetch(base+'/api/progress',{headers:{Cookie:cookie}});assert.deepEqual((await persisted.json()).progress,progress);
});
