import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const dist=new URL('dist/',root);
async function saveGenerated(path,contents){
 const file=new URL(path,root);
 if(process.argv.includes('--check')){
  if(await readFile(file,'utf8')!==contents)throw Error(path+' wymaga npm run sync:entry');
 }else await writeFile(file,contents);
}
const source=await readFile(new URL('index.html',dist),'utf8');
const target=source.replaceAll(/(src|href)="((?:theme|app|pwa)\.js[^"]*|(?:styles|modern)\.css[^"]*|icons\/[^"]+)"/g,'$1="dist/$2"');
await saveGenerated('index.html',target);

const manifest=JSON.parse(await readFile(new URL('manifest.webmanifest',dist),'utf8'));
const rootManifest={...manifest,icons:manifest.icons.map(icon=>({...icon,src:'dist/'+icon.src}))};
await saveGenerated('manifest.webmanifest',JSON.stringify(rootManifest,null,2)+'\n');

// Keep the offline shell and the exact versioned module URLs in the same release.
const assets=new Map();
const pending=[...source.matchAll(/(?:src|href)="([\w./-]+\.(?:js|css|webmanifest|png)(?:\?[^"]*)?)"/g)].map(match=>new URL(match[1],dist));
pending.push(...['vendor/stockfish/stockfish-19-lite-single.wasm',...manifest.icons.map(icon=>icon.src)].map(path=>new URL(path,dist)));
while(pending.length){
 const url=pending.pop();
 const path=url.href.slice(dist.href.length);
 if(path==='sw.js'||assets.has(path))continue;
 const bytes=await readFile(new URL(url.pathname,dist));
 assets.set(path,bytes);
 if(!url.pathname.endsWith('.js'))continue;
 const imports=bytes.toString().matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bnew URL\s*\(\s*)['"]((?:\.\/|[\w-]+\/)?[\w./-]+\.(?:js|json|wasm)(?:\?[^'"]*)?)['"]/g);
 for(const match of imports)pending.push(new URL(match[1],url));
}
const files=[...assets.keys()].sort();
const hash=createHash('sha256').update(source).update(await readFile(new URL('sw.js',dist)));
for(const path of files)hash.update(path).update(assets.get(path));
const offline={version:hash.digest('hex').slice(0,16),assets:files};
await saveGenerated('dist/offline-assets.js','self.ACADEMY_OFFLINE='+JSON.stringify(offline,null,2)+';\n');
