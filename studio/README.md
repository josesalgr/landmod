# LANDMOD · News editor

Project: `8wkx4imp`. Dataset: `editorial-test` (public). Never store private information here, including in drafts.

Published Studio: https://josesalgr.github.io/landmod/editor/
The footer Team access link redirects here.

## Publishing

1. Sign in with the same Sanity account/method used to join the project.
2. Open Noticias y actividades and create a document.
3. In Datos e imagen, choose category/date and upload an image; add its credit.
4. In English, enter title, short summary and body. Spanish and Catalan are optional and fall back to English.
5. Drafts save automatically. Click Publish when ready. Reload the website to see the update; no GitHub deployment is necessary for editorial changes.
6. Contenido de prueba excludes an entry from the public website even if published.

The existing file-based news remain as a fallback. Sanity adds new editorial entries. Current news have not been migrated and other catalogues remain file-based.

## Initial setup

In Sanity Manage → API → CORS origins, allow `https://josesalgr.github.io` with credentials, since this is the Studio hosting origin. Allow local development origins only if needed. Invite editors via project Members; never share passwords or put write tokens in the website.

The browser uses only the public published-perspective read API. Writes require Sanity authentication in Studio. The Studio is built in GitHub Actions and hosted on GitHub Pages; only published News are read live.

## Development

From studio: npm ci; npm run dev. Configure a local basePath override if serving independently. Production basePath is /landmod/editor.

## Publicaciones por DOI

Selecciona Publicaciones · añadir por DOI, crea una ficha, pega el DOI o su enlace y pulsa Recuperar datos. Revisa título, autores, revista, fecha y tipo; selecciona los miembros de LANDMOD y pulsa Publicar. Se consulta Crossref, con DataCite como alternativa. Si el DOI ya existe en el catálogo, la web actualiza la referencia sin duplicarla. Los preprints se identifican por separado. Las referencias antiguas siguen en el catálogo local; no se han migrado al editor.

## Proyectos y Software
Las fichas se editan en Proyectos y Software, incluidos logos, enlaces y traducciones. Publicar actualiza la web al recargar, sin desplegar código. Inglés es el respaldo cuando falta una traducción. Desactivar «Mostrar en la web» y publicar retira la ficha. Los proyectos mantienen el orden por vigencia y permiten destacar hasta cuatro en el inicio.
La herramienta «Importar fichas actuales» carga 11 proyectos y 5 herramientas con IDs estables usando createIfNotExists; repetirla no sobrescribe ediciones. Las copias locales sirven de respaldo si Sanity no responde.

## People
People · Equipo permite crear, editar, ordenar y ocultar miembros. Incluye fotos con punto de interés, perfil, correo público, LinkedIn, ORCID, puesto y especialidades en inglés, español y catalán. Publicar actualiza la web al recargar. La importación inicial añade 13 miembros con IDs estables y no sobrescribe cambios posteriores.
