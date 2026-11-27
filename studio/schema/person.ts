import {defineType,defineField} from 'sanity'
const langs=[['en','English'],['es','Español'],['ca','Català']]
export const person=defineType({name:'person',title:'Miembro del equipo',type:'document',initialValue:{visible:true,sortOrder:100},groups:langs.map(([name,title])=>({name,title})),fields:[
 defineField({name:'name',title:'Nombre y apellidos',type:'string',validation:R=>R.required()}),
 defineField({name:'catalogId',title:'Identificador estable',type:'string',readOnly:true,hidden:true}),
 defineField({name:'visible',title:'Mostrar en People',type:'boolean',description:'Desactívalo y publica para retirar la ficha sin borrarla.'}),
 defineField({name:'sortOrder',title:'Orden en el equipo',type:'number',description:'Los números menores aparecen primero.',validation:R=>R.min(0)}),
 defineField({name:'photo',title:'Fotografía',type:'image',options:{hotspot:true},description:'Sube una foto y ajusta el punto de interés para centrar el rostro.'}),
 defineField({name:'image',title:'Fotografía actual (URL)',type:'url',description:'Se utiliza mientras no subas una fotografía nueva.'}),
 defineField({name:'profile',title:'Perfil institucional o web personal',type:'url'}),
 defineField({name:'email',title:'Correo de contacto público',type:'string',validation:R=>R.email()}),
 defineField({name:'linkedin',title:'LinkedIn',type:'url'}),
 defineField({name:'orcid',title:'ORCID',type:'url'}),
 ...langs.flatMap(([l,title])=>[
 defineField({name:'role_'+l,title:'Puesto · '+title,type:'string',group:l,validation:R=>l==='en'?R.required():R}),
 defineField({name:'expertise_'+l,title:'Especialidades · '+title,type:'text',rows:3,group:l,description:'Una o dos líneas para presentar su experiencia.'})
 ])
 ],orderings:[{title:'Orden del equipo',name:'teamOrder',by:[{field:'sortOrder',direction:'asc'}]}],preview:{select:{title:'name',subtitle:'role_en',media:'photo'}}})
