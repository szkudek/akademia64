import { readFile, writeFile } from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const source=await readFile(new URL('dist/index.html',root),'utf8');
const target=source.replaceAll('src="theme.js','src="dist/theme.js').replaceAll('href="styles.css"','href="dist/styles.css"').replaceAll('href="modern.css','href="dist/modern.css').replaceAll('src="app.js','src="dist/app.js');
await writeFile(new URL('index.html',root),target);
