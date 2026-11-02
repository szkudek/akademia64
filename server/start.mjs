import { createApp } from './app.mjs';
const host=process.env.HOST||'127.0.0.1';const port=Number(process.env.PORT||4173);
const app=await createApp();app.server.listen(port,host,()=>console.log(`Akademia 64: http://${host}:${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>app.close().then(()=>process.exit(0)));
