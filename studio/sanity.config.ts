import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {esESLocale} from '@sanity/locale-es-es'
import {newsPost} from './schema/newsPost'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '8wkx4imp'
if (!projectId || !/^[a-z0-9]+$/.test(projectId)) {
  throw new Error('Falta conectar el proyecto: añade SANITY_STUDIO_PROJECT_ID en studio/.env.local. Consulta studio/README.md.')
}

export default defineConfig({
  name: 'landmod',
  title: 'LANDMOD · Equipo',
  projectId,
  dataset: process.env.SANITY_STUDIO_DATASET || 'editorial-test',
  plugins: [
    structureTool({structure: S => S.list().title('Contenido').items([
      S.documentTypeListItem('newsPost').title('Noticias y actividades'),
    ])}),
    esESLocale(),
  ],
  schema: {types: [newsPost]},
})
