import { createApp } from './app.mjs';
const port=Number(process.env.PORT||4173);
const host=process.env.HOST||'127.0.0.1';
const app=await createApp({dbPath:process.env.DATABASE_PATH,origin:process.env.APP_ORIGIN||null,production:process.env.NODE_ENV==='production'});
app.server.listen(port,host,()=>console.log(`Akademia 64: http://${host}:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>app.close().then(()=>process.exit(0)));
