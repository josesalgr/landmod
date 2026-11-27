import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {esESLocale} from '@sanity/locale-es-es'
import {newsPost} from './schema/newsPost'
import {publication} from './schema/publication'
const projectId=process.env.SANITY_STUDIO_PROJECT_ID||'8wkx4imp'
export default defineConfig({
 name:'landmod',title:'LANDMOD · Equipo',projectId,
 dataset:process.env.SANITY_STUDIO_DATASET||'editorial-test',
 plugins:[structureTool({structure:S=>S.list().title('Contenido').items([
  S.documentTypeListItem('newsPost').title('Noticias y actividades'),
  S.documentTypeListItem('publication').title('Publicaciones · añadir por DOI'),
 ])}),esESLocale()],
 schema:{types:[newsPost,publication]},
})
