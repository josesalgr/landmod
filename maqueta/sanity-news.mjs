export const projectId='8wkx4imp';
export const dataset='editorial-test';
const languages=['en','es','ca'];
const safeURL=v=>typeof v==='string'&&/^https?:\/\//i.test(v)?v:'';
const escapeText=v=>String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/[\\`*_[\]{}]/g,'\\$&');
export function portableText(blocks){
 if(!Array.isArray(blocks))return '';
 return blocks.filter(b=>b._type==='block').map(b=>{
  const text=(b.children||[]).map(s=>{let text=escapeText(s.text);for(const mark of s.marks||[]){if(mark==='strong')text='**'+text+'**';else if(mark==='em')text='*'+text+'*';else {const def=(b.markDefs||[]).find(d=>d._key===mark);if(safeURL(def?.href))text='['+text+']('+def.href.replace(/[()\s]/g,c=>encodeURIComponent(c))+')';}}return text;}).join('');
  return (b.listItem==='bullet'?'- ':b.listItem==='number'?'1. ':b.style==='h2'?'## ':'')+text;
 }).join('\n\n');
}
export function sanityImage(image){
 const ref=image?.asset?._ref;if(!ref)return '';
 const match=/^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-([a-zA-Z0-9]+)$/.exec(ref);if(!match)return '';
 const url=new URL(`https://cdn.sanity.io/images/${projectId}/${dataset}/${match[1]}-${match[2]}x${match[3]}.${match[4]}`);
 url.searchParams.set('auto','format');url.searchParams.set('w','1200');url.searchParams.set('fit','max');return url.href;
}
export function newsFromSanity(doc){
 if(!doc||doc._type!=='newsPost'||doc._id?.startsWith('drafts.')||doc.example===true||!['note','conference','activity','blog'].includes(doc.category)||!/^\d{4}-\d{2}-\d{2}$/.test(doc.date||'')||!doc.title_en?.trim())return null;
 const bodyEn=portableText(doc.body_en);if(!bodyEn.trim())return null;
 const localised=field=>Object.fromEntries(languages.map(l=>[l,doc[field+'_'+l]?.trim()||doc[field+'_en']?.trim()||'']));
 const bodies=Object.fromEntries(languages.map(l=>[l,portableText(doc['body_'+l])||bodyEn]));
 const image=sanityImage(doc.image);
 return {id:'sanity-'+doc._id,type:doc.category,date:doc.date,date_precision:'day',title:localised('title'),summary:localised('summary'),body:bodies,image,thumbnail:image,image_alt:localised('alt'),thumbnail_source:safeURL(doc.image?.source),thumbnail_credit:Object.fromEntries(languages.map(l=>[l,doc.image?.credit||''])),url:safeURL(doc.resourceUrl),social:'',source:'',published:true,example:false,editorial_source:'sanity'};
}
export function publicationFromSanity(doc){
 if(!doc||doc._type!=='publication'||doc._id?.startsWith('drafts.')||doc.example===true||!/^10\.\d{4,9}\/\S+$/i.test(doc.doi||'')||!doc.title?.trim()||!/^\d{4}-\d{2}-\d{2}$/.test(doc.date||''))return null;
 const doi=doc.doi.toLowerCase(),title=Object.fromEntries(languages.map(l=>[l,doc.title]));
 const kind=['article','preprint','chapter','conference','dataset','software','report','other'].includes(doc.kind)?doc.kind:'article';
 return {id:'sanity-'+doc._id,type:'paper',doi,title,scientific_title:doc.title,authors:doc.authors||'',venue:doc.venue||'',date:doc.date,date_precision:doc.datePrecision||'day',publication_kind:kind,paper_status:kind==='preprint'?'preprint':doc.paperStatus||'published',url:'https://doi.org/'+doi,source:safeURL(doc.metadataSource),body:{en:'Follow the DOI to read the original publication.',es:'Consulta el DOI para leer la publicación original.',ca:'Consulta el DOI per llegir la publicació original.'},team_members:doc.teamMembers||[],published:true,bibliographic:true,example:false,editorial_source:'sanity'};
}
export function mergeEditorialEntries(existing,incoming){
 const entries=[...existing],keys=new Map(entries.map((e,i)=>[(e.doi||e.id).toLowerCase().replace(/^https?:\/\/doi\.org\//,''),i]));
 for(const entry of incoming){const key=(entry.doi||entry.id).toLowerCase(),index=keys.get(key);
  if(index===undefined){keys.set(key,entries.length);entries.push(entry);}
  else{const previous=entries[index];entries[index]={...previous,...entry,id:previous.id,team_members:entry.team_members?.length?entry.team_members:previous.team_members};}
 }
 return entries;
}
export function catalogueFromSanity(doc){
 if(!doc||!['researchProject','softwareTool'].includes(doc._type)||doc._id?.startsWith('drafts.')||!doc.name?.trim())return null;
 const project=doc._type==='researchProject',id=doc.catalogId||'sanity-'+doc._id;
 const result={...doc,id,kind:project?'project':doc.kind==='web'?'web':'r',url:safeURL(doc.url),editorial_source:'sanity',visible:doc.visible!==false,logo:sanityImage(doc.logoImage)||safeURL(doc.logo)};
 if(doc.logoImage?.asset){const m=/-(\d+)x(\d+)-/.exec(doc.logoImage.asset._ref);if(m){result.logo_size=[+m[1],+m[2]];result.logo_viewbox=[0,0,+m[1],+m[2]];}}
 for(const field of ['label','description'])for(const l of languages)result[field+'_'+l]=doc[field+'_'+l]?.trim()||doc[field+'_en']||'';
 for(const field of ['documentation','repository','cran'])result[field]=safeURL(doc[field]);
 if(doc.institution?.name)result.institution={name:doc.institution.name,url:safeURL(doc.institution.url),logo:sanityImage(doc.institution.logoImage)||safeURL(doc.institution.logo)};
 else delete result.institution;
 return result;
}
export function mergeCatalogue(existing,incoming,project=false){
 const key=e=>e.catalogId||e.id||(project?e.name.toLowerCase().replace(/[^a-z0-9]+/g,'-'):e.name);
 const items=new Map(existing.map((e,i)=>[key(e),{...e,sortOrder:i}]));
 for(const e of incoming)items.set(key(e),e);
 return [...items.values()].filter(e=>e.visible!==false).sort((a,b)=>(a.sortOrder??100)-(b.sortOrder??100));
}
export async function fetchSanityContent(){
 const query='*[_type in ["newsPost","publication","researchProject","softwareTool"] && !(_id in path("drafts.**")) && example != true] | order(date desc)';
 const url=new URL(`https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`);
 url.searchParams.set('perspective','published');url.searchParams.set('query',query);
 const response=await fetch(url,{signal:AbortSignal.timeout(4000),credentials:'omit',cache:'no-store'});
 if(!response.ok)throw Error('Sanity editorial content unavailable');
 const {result}=await response.json();if(!Array.isArray(result))throw Error('Invalid Sanity response');
 return result.map(doc=>doc._type==='publication'?publicationFromSanity(doc):['researchProject','softwareTool'].includes(doc._type)?catalogueFromSanity(doc):newsFromSanity(doc)).filter(Boolean);
}
export async function fetchSanityNews(){return (await fetchSanityContent()).filter(e=>['note','conference','activity','blog'].includes(e.type));}
