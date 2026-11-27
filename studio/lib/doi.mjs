export function normaliseDOI(value){
 let doi=String(value||'').trim().replace(/^doi:\s*/i,'').replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'');
 try{doi=decodeURIComponent(doi);}catch{}
 if(!/^10\.\d{4,9}\/\S+$/i.test(doi))throw Error('Pega un DOI válido o un enlace https://doi.org/…');
 return doi.toLowerCase();
}
const clean=v=>String(v||'').replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"').trim();
function dateValue(parts){
 if(!parts?.[0])throw Error('La fuente no indica fecha de publicación; complétala manualmente.');
 return {date:[parts[0],String(parts[1]||1).padStart(2,'0'),String(parts[2]||1).padStart(2,'0')].join('-'),datePrecision:parts.length>=3?'day':parts.length===2?'month':'year'};
}
export function crossrefPublication(m,doi){
 const kind={'journal-article':'article','proceedings-article':'conference','book-chapter':'chapter','posted-content':'preprint','dataset':'dataset','report':'report'}[m.type]||'other';
 return {doi:normaliseDOI(m.DOI||doi),title:clean(m.title?.[0]),authors:(m.author||[]).map(a=>clean(a.name||[a.given,a.family].filter(Boolean).join(' '))).filter(Boolean).join('; '),venue:clean(m['container-title']?.[0]||m.publisher),...dateValue((m['published-print']||m.published||m['published-online']||m.issued)?.['date-parts']?.[0]),kind,paperStatus:kind==='preprint'?'preprint':'published',metadataSource:'https://api.crossref.org/works/'+encodeURIComponent(doi)};
}
export function datacitePublication(m,doi){
 const type=m.types?.resourceTypeGeneral;const kind={JournalArticle:'article',Preprint:'preprint',Dataset:'dataset',Software:'software',ConferencePaper:'conference',BookChapter:'chapter',Report:'report'}[type]||'other';
 const dates=m.dates||[];const date=dates.find(d=>d.dateType==='Issued')?.date||dates.find(d=>d.dateType==='Available')?.date||String(m.publicationYear||'');
 return {doi:normaliseDOI(m.doi||doi),title:clean(m.titles?.[0]?.title),authors:(m.creators||[]).map(a=>clean(a.name||[a.givenName,a.familyName].filter(Boolean).join(' '))).join('; '),venue:clean(m.container?.title||m.publisher),...dateValue(date.split('-').slice(0,3).map(Number)),kind,paperStatus:kind==='preprint'?'preprint':'published',metadataSource:'https://api.datacite.org/dois/'+encodeURIComponent(doi)};
}
export async function lookupDOI(value,fetcher=fetch){
 const doi=normaliseDOI(value);const options={credentials:'omit',signal:AbortSignal.timeout(15000)};
 const res=await fetcher('https://api.crossref.org/works/'+encodeURIComponent(doi),options);
 if(res.ok){const result=crossrefPublication((await res.json()).message,doi);if(!result.title)throw Error('No se ha encontrado un título. Completa la ficha manualmente.');return result;}
 if(res.status!==404)throw Error('Crossref no responde ahora. Inténtalo de nuevo o rellena la ficha manualmente.');
 const alternate=await fetcher('https://api.datacite.org/dois/'+encodeURIComponent(doi),options);
 if(!alternate.ok)throw Error('DOI no encontrado. Comprueba el enlace o rellena los datos manualmente.');
 const result=datacitePublication((await alternate.json()).data.attributes,doi);if(!result.title)throw Error('No se ha encontrado un título.');return result;
}
