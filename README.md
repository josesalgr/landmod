## Estado actual de publicación y edición

Web: https://josesalgr.github.io/landmod/ · Repositorio: josesalgr/landmod.
News incorpora entradas publicadas en Sanity (8wkx4imp / editorial-test), con el catálogo local como respaldo. Borradores y contenido de prueba no aparecen. El editor se construye en GitHub Actions y se sirve en /landmod/editor/; /admin/ redirige a ese panel. Configuración de acceso inicial y guía: [studio/README.md](studio/README.md).
Los demás catálogos siguen en archivos del repositorio. Las instrucciones antiguas de Decap que siguen abajo corresponden a la primera maqueta.

# LANDMOD · Web y gestor de contenidos

Sitio bilingüe con noticias, publicaciones, actividades y blog. Complementa la ficha institucional del CTFC, donde se mantienen personas, líneas y proyectos.

La versión actual incorpora el equipo del directorio CTFC revisado el 25/11/2026, seis publicaciones contrastadas con sus registros DOI, referencias de FORESFUTURE y REMAINS y cinco proyectos/herramientas. Ya no se muestran contenidos de ejemplo. La procedencia y los criterios de selección están documentados en `content/SOURCES.md`.

El panel incluye «Equipo» y «Proyectos y herramientas» para actualizar fotografías, puestos y enlaces sin modificar el diseño. La fecha bibliográfica puede mostrarse por día, mes o año según lo que se conozca. Las fichas admiten enlaces directos compartibles.

Las noticias, actividades, artículos y entradas de blog se leen ahora en `entry.html?id=…&lang=es` o `lang=en`, con una página propia. Los enlaces antiguos `?entry=…` redirigen a ese formato. La sección `software.html` reúne FORMES, REMAINS, medfate y medfateland con filtros, documentación y autoría. El panel permite editarla en «Software y herramientas».

El idioma predeterminado es inglés; `?lang=es` permite consultar español. El inicio solo muestra una introducción breve y «Latest news», con novedades de todas las categorías. Equipo, publicaciones, actividades, investigación y cuaderno tienen páginas independientes en `section.html?view=…`; el software conserva su propia página. El menú mantiene el idioma elegido.

Cada noticia del inicio muestra una miniatura y un resumen de hasta dos líneas. En Decap, «Miniatura para las noticias» permite subir la imagen y los campos de resumen ES/EN permiten redactar un texto específico. Si no hay resumen, se utiliza el primer párrafo. Las miniaturas actuales son fotografías de publicaciones institucionales del CTFC, con fuente y crédito en cada ficha. Para los artículos se utilizan fotos de contexto: no se presentan como figuras del estudio. Los filtros de noticias se generan según las categorías presentes y muestran sus recuentos.

## Iniciar

Con Node.js 24 y dependencias instaladas, abre `Iniciar LANDMOD.cmd` o ejecuta `npm run dev`. Mantén esa ventana abierta mientras editas.

- Web: http://127.0.0.1:8000/
- Panel Decap: http://127.0.0.1:8000/admin/
- Guía: http://127.0.0.1:8000/admin/guia.html

En otro ordenador, instala antes las dependencias: `npm ci --ignore-scripts`. El botón «Iniciar sesión» del panel local da acceso de desarrollo sin cuenta remota. El servidor solo escucha en este ordenador.

En este entorno npm no está en PATH: se puede ejecutar con `node .tools/npm/bin/npm-cli.js`. Esa copia de npm no se sube al repositorio.

## Editar

Elige una sección, crea una entrada y escribe en español y opcionalmente inglés. Puedes dar formato al texto, subir imágenes y añadir enlaces.

Las entradas nuevas empiezan con **Mostrar en la web desactivado**. «Publicar ahora» en Decap guarda el archivo; el interruptor determina si aparece en la web. Actívalo cuando esté listo y guarda. En local, recarga la portada.

Los cambios se guardan en archivos de `content/`, no en el navegador. Las imágenes se guardan en `maqueta/uploads/`. Incluye ambas carpetas en las copias de seguridad. No se envían mensajes a redes sociales: se enlazan publicaciones existentes.

## Importar referencias

En «Bibliografía (BibTeX)», agrega y sube un archivo `.bib` exportado de Zotero u otro gestor. Guarda y recarga la web. Se conserva el título original. El año bibliográfico se representa como 1 de enero para ordenar las referencias; no es la fecha exacta de publicación.

Para añadir una explicación propia, crea una ficha en «Artículos científicos» con el mismo DOI: tiene prioridad sobre el registro importado. Se evitan duplicados por DOI; sin DOI se utiliza la clave BibTeX, que debe ser única entre archivos.

No se consulta automáticamente Zotero, ORCID ni Google Scholar. Las referencias importadas se muestran en Artículos y no llenan la tabla de noticias.

## Conexión compartida pendiente

No hay repositorio remoto, servidor de autenticación ni alojamiento conectados. Nada se ha subido a internet. Para conectar el backend GitHub de Decap:

1. Conectar/crear el repositorio en la cuenta elegida, con rama `main`.
2. Configurar un servidor OAuth compatible con Decap. Sus secretos se guardan en ese servidor, nunca en el JavaScript público.
3. Definir las variables de compilación `CMS_PRODUCTION=1`, `CMS_REPO=propietario/repositorio`, `CMS_AUTH_URL=https://servidor-oauth`. Opcionales: `CMS_AUTH_ENDPOINT` y `CMS_BRANCH`.
4. Ejecutar `npm run build` y alojar `dist/`. Configurar el alojamiento para regenerar la web con cada cambio del repositorio.
5. Comprobar inicio de sesión, permisos, subida de imágenes y publicación real antes de dar acceso al equipo.

El flujo de GitHub incluido comprueba el proyecto y genera un artefacto de vista previa; no despliega ni concede permisos. El despliegue se conectará al elegir alojamiento. Las rutas asumen raíz de dominio; GitHub Pages bajo una subcarpeta requiere adaptarlas.

## Copias anteriores

El editor provisional sigue en `maqueta/editor-legacy.html` para exportar posibles cambios de localStorage; no se incluye en la versión de publicación. Esos borradores no se migran automáticamente. El CMS parte de los ejemplos guardados en el proyecto.

## Comprobar

`npm test` verifica contenido, enlaces, configuración e importación BibTeX. `npm run build` genera `dist/`. Se ha comprobado en navegador la edición, el guardado y la lectura de una entrada.

### Catálogo bibliográfico 2024–2026

`content/publications.json` contiene referencias contrastadas con Crossref/DataCite, con tipo de resultado y miembros del equipo. Se integran en Publications y no crean noticias automáticas. Los DOI ya presentes en las fichas editoriales no se duplican. `content/publication-audit.json` registra cobertura y exclusiones. La página incluye filtros por año y tipo, búsqueda y descarga BibTeX. Se pueden seguir añadiendo fichas y archivos BibTeX desde el panel existente. La búsqueda pública no garantiza exhaustividad, especialmente para trabajos sin DOI.
