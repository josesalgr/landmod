import test from 'node:test';
import assert from 'node:assert/strict';
import {newsFromSanity,portableText,sanityImage,fetchSanityNews} from '../maqueta/sanity-news.mjs';
const post={_id:'news-1',_type:'newsPost',date:'2026-11-27',category:'note',title_en:'Test news',summary_en:'Short summary',body_en:[{_type:'block',children:[{_type:'span',text:'Hello world',marks:[]}]}]};
test('Sanity news excludes drafts, test content and unsupported categories',()=>{
 assert.equal(newsFromSanity({...post,_id:'drafts.news-1'}),null);
 assert.equal(newsFromSanity({...post,example:true}),null);
 assert.equal(newsFromSanity({...post,category:'paper'}),null);
 assert.equal(newsFromSanity({...post,body_en:[]}),null);
});
test('Published news retains stable IDs and falls back to English',()=>{
 const entry=newsFromSanity(post);assert.equal(entry.id,'sanity-news-1');assert.equal(entry.title.ca,post.title_en);assert.equal(entry.body.es,'Hello world');assert.equal(entry.summary.es,'Short summary');
});
test('Rich text escapes HTML and rejects unsafe links and image references',()=>{
 const body=portableText([{_type:'block',markDefs:[{_key:'bad',href:'javascript:alert(1)'}],children:[{text:'<script>alert(1)</script>',marks:['bad']}]}]);
 assert.ok(!body.includes('<script>'));assert.ok(!body.includes('javascript:'));assert.equal(sanityImage({asset:{_ref:'../../evil'}}),'');
 assert.match(sanityImage({asset:{_ref:'image-abc123-800x600-png'}}),/^https:\/\/cdn.sanity.io\/images\/8wkx4imp\/editorial-test\/abc123-800x600.png/);
});
test('Public API requests published perspective without credentials',async()=>{
 const original=globalThis.fetch;try {globalThis.fetch=async(url,options)=>{assert.equal(url.searchParams.get('perspective'),'published');assert.equal(options.credentials,'omit');return {ok:true,json:async()=>({result:[post,{...post,_id:'drafts.no'}]})};};assert.equal((await fetchSanityNews()).length,1);}finally{globalThis.fetch=original;}
});
