# Manual de usuario de PDI

Manual privado en español, con 19 capítulos sobre las pantallas y los recorridos de PDI.

Este repositorio contiene únicamente la documentación, su plantilla y las herramientas para generar el manual. Su historial es independiente del repositorio de la aplicación. No contiene la aplicación, configuraciones de acceso ni una base de datos.

GitHub Pages está desactivado y no hay publicación automática. El acceso al repositorio requiere autorización.

## Estado de la edición

La edición inicial del 13 de noviembre de 2026 incluye 158 tareas. Se aplicaron las 18 correcciones de la revisión MN5.2. Quedan revisiones de integración y 78 capturas pendientes, representadas en el manual mediante recuadros descriptivos.

## Editar y comprobar

Requiere Node.js 22 o posterior. No necesita instalar paquetes.

1. Edite los capítulos en `DOCS/manual/capitulos/` respetando `DOCS/manual/GUIA_REDACCION.md` y `DOCS/manual/glosario.md`.
2. Ejecute `npm run check` para comprobar los capítulos, o `npm run build` para comprobarlos y generar el manual.
3. Abra `_site/index.html` en el navegador. También funciona sin conexión.
4. Suba los cambios a la rama `main` de este repositorio privado. Esta operación conserva los archivos y no publica un sitio web.

La primera edición conserva tres avisos de vocabulario conocidos: dos citas literales de mensajes en C03 y un uso de «capacidad» en C07. Los errores de validación impiden generar el manual.

Los cambios de este repositorio y los de la aplicación no se sincronizan automáticamente. Antes de actualizar el manual, contraste los nombres de los controles y los procedimientos con la versión correspondiente de PDI.
