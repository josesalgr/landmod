import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  project: {basePath: '/landmod/editor'},
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '8wkx4imp',
    dataset: process.env.SANITY_STUDIO_DATASET || 'editorial-test',
  },
})
