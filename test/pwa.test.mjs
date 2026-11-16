import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root=new URL('../',import.meta.url);
const read=path=>readFile(new URL(path,root),'utf8');

test('PWA release paths and generated manifests are current',async()=>{
 execFileSync(process.execPath,['scripts/sync-entry.mjs','--check'],{cwd:root});
 for(const prefix of ['', 'dist/']){
  const manifest=JSON.parse(await read(prefix+'manifest.webmanifest'));
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.scope,manifest.start_url);
  for(const icon of manifest.icons){
   const png=await readFile(new URL(prefix+icon.src,root));
   const [width,height]=icon.sizes.split('x').map(Number);
   assert.equal(png.readUInt32BE(16),width);
   assert.equal(png.readUInt32BE(20),height);
  }
 }
});

test('both release layouts can install and use their cached shell offline',async()=>{
 const assetScript=await read('dist/offline-assets.js');
 const workerCode=await read('dist/sw.js');
 for(const assetPrefix of ['', 'dist/']){
  const scope='https://example.test/akademia64/';
  const callbacks={};
  const saved=new Map();
  const self={ACADEMY_ASSET_PATH:assetPrefix,registration:{scope},addEventListener:(event,callback)=>{callbacks[event]=callback}};
  vm.runInNewContext(assetScript,{self});
  const filesOnDisk=assetPrefix?'':'dist/';
  vm.runInNewContext(workerCode,{
   self,URL,Request,importScripts(){},
   caches:{async open(){
    return {
     async addAll(requests){
      for(const request of requests){
       const path=new URL(request.url).pathname.slice(new URL(scope).pathname.length);
       const diskPath=path==='index.html'||path==='manifest.webmanifest'?filesOnDisk+path:path.startsWith('dist/')?path:'dist/'+path;
       assert.ok((await readFile(new URL(diskPath,root))).length,path);
       saved.set(request.url,new Response(path));
      }
     },
     async match(url){return saved.get(url)}
    };
   }},
   fetch(){throw Error('Offline')}
  });
  let result;
  callbacks.install({waitUntil:promise=>{result=promise}});
  await result;
  const resolve=url=>{
   let response;
   callbacks.fetch({request:{url,method:'GET',mode:url===scope?'navigate':'cors'},respondWith:value=>{response=value}});
   return response;
  };
  assert.equal(await (await resolve(scope)).text(),'index.html');
  const appPath=self.ACADEMY_OFFLINE.assets.find(path=>path.startsWith('app.js?'));
  assert.ok(appPath);
  const entry=scope+assetPrefix+appPath;
  assert.ok(await resolve(entry));
  assert.ok(await resolve(scope+assetPrefix+'vendor/stockfish/stockfish-19-lite-single.wasm'));
  assert.equal(resolve('https://firestore.googleapis.com/v1/projects'),undefined);
  assert.equal(resolve(scope+assetPrefix+'puzzles/shard.json'),undefined);
 }
});
