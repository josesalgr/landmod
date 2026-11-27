import fs from 'node:fs/promises';
import path from 'node:path';
import {root,readContent,vendor,cmsConfig} from './content.mjs';
const out=path.join(root,'dist');await fs.mkdir(out,{recursive:true});
for(const name of ['index.html','entry.html','section.html','software.html','app.js','sanity-news.mjs','styles.css','admin','uploads']){const source=path.join(root,'maqueta',name);try{await fs.cp(source,path.join(out,name),{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}}
await vendor(out);await fs.writeFile(path.join(out,'content.json'),JSON.stringify(await readContent(),null,2));
await fs.writeFile(path.join(out,'admin/config.json'),JSON.stringify(await cmsConfig(process.env.CMS_PRODUCTION==='1'),null,2));
console.log(`Web generada en ${out}. ${process.env.CMS_PRODUCTION==='1'?'Panel remoto configurado.':'Panel en modo local; falta conectar acceso compartido.'}`);
