// Optional local static server. Authentication and progress are handled by Firebase.
import { createServer } from 'node:http';
import { readFile,stat } from 'node:fs/promises';
import { resolve,extname,sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const rootDefault=fileURLToPath(new URL('../dist/',import.meta.url));
export async function createApp({staticRoot=rootDefault}={}){
  const root=resolve(staticRoot);
  const server=createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','same-origin');
    res.setHeader('X-Frame-Options','DENY');
    const wasmPolicy=req.url==='/vendor/stockfish/stockfish-19-lite-single.js'?" 'wasm-unsafe-eval'":'';
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'" + wasmPolicy + " https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://i.ytimg.com; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.gstatic.com; frame-src https://akademia64-89e49.firebaseapp.com https://www.youtube-nocookie.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    try{
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return}
      const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      if(pathname.split('/').some(p=>p.startsWith('.'))||pathname.includes('\\'))throw Error();
      const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
      if(!path.startsWith(root+sep)||!(await stat(path)).isFile())throw Error();
      const bytes=await readFile(path);const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.txt':'text/plain; charset=utf-8','.gif':'image/gif','.png':'image/png','.wasm':'application/wasm'};
      res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:bytes);
    }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Nie znaleziono strony.')}
  });
  return {server,close:()=>new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()))};
}
