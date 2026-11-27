import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const out=path.resolve('dist');
async function patch(dir){for(const ent of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,ent.name);if(ent.isDirectory()){if(ent.name!=='editor')await patch(file);}else if(/\.(html|css|js|json)$/.test(ent.name)){const text=await fs.readFile(file,'utf8');await fs.writeFile(file,text.replaceAll('/uploads/','/landmod/uploads/').replaceAll('\\/uploads\\/','\\/landmod\\/uploads\\/'));}}}
await patch(out);
await fs.writeFile(path.join(out,'.nojekyll'),'');
await fs.writeFile(path.join(out,'admin/index.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=../editor/"><title>LANDMOD editor</title><body><a href="../editor/">Open LANDMOD editor</a></body></html>');
// Version the live-news reader as well as the main script.
const newsVersion=createHash('sha256').update(await fs.readFile(path.join(out,'sanity-news.mjs'))).digest('hex').slice(0,12);
const appPath=path.join(out,'app.js');
await fs.writeFile(appPath,(await fs.readFile(appPath,'utf8')).replace('./sanity-news.mjs?v=1','./sanity-news.mjs?v='+newsVersion));
// Give each changed asset its own URL so browser caches cannot retain an old menu.
const versions={};
for(const name of ['app.js','styles.css'])versions[name]=createHash('sha256').update(await fs.readFile(path.join(out,name))).digest('hex').slice(0,12);
for(const name of ['index.html','section.html','entry.html','software.html']){
 const file=path.join(out,name);let html=await fs.readFile(file,'utf8');
 for(const [asset,version] of Object.entries(versions))html=html.replaceAll('"'+asset+'"','"'+asset+'?v='+version+'"');
 await fs.writeFile(file,html);
}
console.log('Prepared GitHub Pages paths and versioned assets at /landmod/');

// GitHub Pages serves this shell for deep editor routes on reload.
try {
 const editor=await fs.readFile(path.join(out,'editor/index.html'),'utf8');
 await fs.writeFile(path.join(out,'404.html'),editor.replace('<head>','<head><script>if(!location.pathname.startsWith("/landmod/editor/"))location.replace("/landmod/");</script>'));
} catch(error) { if(error.code!=='ENOENT')throw error; }
