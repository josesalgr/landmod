import {defineType,defineField} from 'sanity'
import {PublicationInput} from '../components/PublicationInput'
import {normaliseDOI} from '../lib/doi.mjs'
export const publication=defineType({
 name:'publication',title:'Publicación',type:'document',components:{input:PublicationInput},
 initialValue:{kind:'article',paperStatus:'published',datePrecision:'day'},
 fields:[
  defineField({name:'doi',title:'DOI',type:'string',hidden:true,validation:Rule=>Rule.required().custom((value)=>{try{normaliseDOI(value);return true}catch{return 'Pega un DOI válido.'}})}),
  defineField({name:'title',title:'Título original del artículo',type:'text',rows:3,validation:Rule=>Rule.required()}),
  defineField({name:'authors',title:'Autores',type:'text',rows:3,description:'Nombres separados por punto y coma.',validation:Rule=>Rule.required()}),
  defineField({name:'venue',title:'Revista o publicación',type:'string',validation:Rule=>Rule.required()}),
  defineField({name:'date',title:'Fecha de publicación',type:'date',description:'Se toma de la fecha bibliográfica, no de la fecha de registro del DOI.',validation:Rule=>Rule.required()}),
  defineField({name:'datePrecision',title:'Precisión de la fecha',type:'string',options:{list:[{title:'Día',value:'day'},{title:'Mes',value:'month'},{title:'Solo año',value:'year'}]},validation:Rule=>Rule.required()}),
  defineField({name:'kind',title:'Tipo de publicación',type:'string',options:{list:[{title:'Artículo',value:'article'},{title:'Preprint',value:'preprint'},{title:'Capítulo',value:'chapter'},{title:'Congreso',value:'conference'},{title:'Datos',value:'dataset'},{title:'Software',value:'software'},{title:'Informe',value:'report'},{title:'Otro',value:'other'}]},validation:Rule=>Rule.required()}),
  defineField({name:'paperStatus',title:'Estado',type:'string',options:{list:[{title:'Publicado',value:'published'},{title:'Aceptado',value:'accepted'},{title:'Preprint',value:'preprint'}]},validation:Rule=>Rule.required()}),
  defineField({name:'teamMembers',title:'Miembros de LANDMOD que participan',type:'array',of:[{type:'string'}],options:{list:["Núria Aquilué Junyent", "Olivia Cason", "Miquel De Cáceres Ainsa", "Pau Garcia Iñurria", "Erico Kutchartt", "Victoria Paz Madrid Ayala", "Camilo Matus Olivares", "Matías Moreno Faguett", "Jan Moreno Monteys", "José Salgado Rojas", "Inmaculada Navarro Ramírez", "Lukman Yazid", "Quim Zaldo Aubanell"]}}),
  defineField({name:'metadataSource',title:'Fuente de los datos bibliográficos',type:'url',readOnly:true}),
 ],
 preview:{select:{title:'title',subtitle:'venue'},prepare:({title,subtitle})=>({title:title||'Nueva publicación',subtitle})}
})
