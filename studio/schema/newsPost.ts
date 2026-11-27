import {defineType, defineField} from 'sanity'

const languages = [
  {name: 'en', title: 'English', default: true},
  {name: 'es', title: 'Español'},
  {name: 'ca', title: 'Català'},
]

export const newsPost = defineType({
  name: 'newsPost',
  title: 'Noticia o actividad',
  type: 'document',
  groups: [
    {name: 'general', title: 'Datos e imagen'},
    ...languages,
  ],
  initialValue: () => ({category: 'note', example: false, date: new Date().toISOString().slice(0,10)}),
  fields: [
    defineField({name: 'category', title: '¿Qué quieres compartir?', type: 'string', group: 'general',
      options: {list: [
        {title: 'Noticia', value: 'note'},
        {title: 'Curso, taller o actividad', value: 'activity'},
        {title: 'Congreso o presentación', value: 'conference'}, {title: 'Blog / cuaderno', value: 'blog'},
      ], layout: 'dropdown'}, validation: Rule => Rule.required()}),
    defineField({name: 'date', title: 'Fecha', type: 'date', group: 'general', validation: Rule => Rule.required()}),
    defineField({name: 'image', title: 'Fotografía o figura', type: 'image', group: 'general',
      description: 'Sube una imagen y ajusta el recorte y el punto de interés.', options: {hotspot: true},
      fields: [
        {name: 'credit', title: 'Autoría / crédito', type: 'string'},
        {name: 'source', title: 'Fuente original', type: 'url'},
      ]}),
    defineField({name: 'resourceUrl', title: 'Enlace al recurso o inscripción', type: 'url', group: 'general'}),
    defineField({name: 'doi', title: 'DOI del artículo', type: 'string', group: 'general',
      hidden: ({document}) => document?.category !== 'paper',
      validation: Rule => Rule.custom(value => !value || /^10\.\d{4,9}\//.test(value) || 'Escribe el DOI sin https://doi.org/')}),
    defineField({name: 'scientificTitle', title: 'Título científico original', type: 'string', group: 'general',
      description: 'Se conservará en su idioma original.', hidden: ({document}) => document?.category !== 'paper'}),
    ...languages.flatMap(language => [
      defineField({name: `title_${language.name}`, title: 'Título', type: 'string', group: language.name,
        validation: Rule => language.name === 'en' ? Rule.required() : Rule}),
      defineField({name: `summary_${language.name}`, title: 'Resumen para el inicio', type: 'text', rows: 3, group: language.name,
        description: 'Una o dos frases para acompañar la imagen.',
        validation: Rule => language.name === 'en' ? Rule.required().max(350) : Rule.max(350)}),
      defineField({name: `body_${language.name}`, title: 'Texto de la noticia', type: 'array', group: language.name,
        of: [{type: 'block', styles: [{title: 'Párrafo', value: 'normal'}, {title: 'Subtítulo', value: 'h2'}],
          marks: {decorators: [{title: 'Negrita', value: 'strong'}, {title: 'Cursiva', value: 'em'}],
            annotations: [{name: 'link', title: 'Enlace', type: 'object', fields: [{name: 'href', title: 'URL', type: 'url'}]}]}}],
        validation: Rule => language.name === 'en' ? Rule.required().min(1) : Rule}),
      defineField({name: `alt_${language.name}`, title: 'Descripción accesible de la imagen', type: 'string', group: language.name}),
    ]),
    defineField({name: 'example', title: 'Contenido de prueba', type: 'boolean', group: 'general',
      description: 'Las pruebas no se incorporarán a la web pública.'}),
  ],
  preview: {
    select: {title: 'title_en', category: 'category', date: 'date', media: 'image', example: 'example'},
    prepare({title, category, date, media, example}) {
      return {title: title || 'Sin título', subtitle: `${example ? 'PRUEBA · ' : ''}${date || ''} · ${category || ''}`, media}
    },
  },
})
