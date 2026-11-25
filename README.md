# Manual de usuario de PDI

Manual de usuario de la Plataforma Docente Integral (PDI). Se publica como una sola página HTML autocontenida: [manual-pdi.html](manual-pdi.html).

## Estructura

- `capitulos/`: un fragmento HTML por capítulo (C01 a C19). Es lo que se edita.
- `plantilla.html`: marco del manual (índice, buscador, tema claro y oscuro, impresión).
- `armar.cjs`: valida los capítulos y arma `manual-pdi.html`.
- `capturas/`: capturas de pantalla (`<código>.jpg`), incrustadas al armar.
- `capturas.md`: lista de capturas con su descripción (la genera `armar.cjs`).
- `GUIA_REDACCION.md`, `glosario.md`, `PRODUCT.md`, `DESIGN.md`: reglas de redacción, términos y diseño.
- `ROADMAP_MANUAL.md`: plan del manual y estado de cada tarea.
- `inventario.md`, `PENDIENTE_CONFIRMAR.md`, `VERIFICACION_*.md`: inventario de pantallas, dudas abiertas y verificaciones.

## Armar el manual

Requiere Node.js, sin dependencias.

```bash
node armar.cjs
```

Opciones: `--solo-revisar` (valida sin escribir), `--estricto`, `--sin-imagenes`.

## Tomar capturas

Las capturas se toman con Playwright contra la aplicación corriendo en `http://localhost:18164`. Esta carpeta vive dentro del repositorio de la aplicación (excluida en su `.gitignore`), así que usa su `node_modules`.

```bash
node capturar-auto.cjs login
node capturar-auto.cjs auto
node capturar-auto.cjs auto "" --extra
```

`login` abre Chrome para que usted inicie sesión; la sesión queda en un archivo temporal que debe borrar al terminar. `auto` toma las capturas sin ventana y `--extra` las que necesitan datos de otra institución. Antes de cada captura, `anonimizar-captura.js` reemplaza correos, cédulas, teléfonos, nombres de personas y de instituciones reales. Los nombres adicionales a ocultar van en `ocultar.local.txt` (uno por línea), que no se sube al repositorio. Revise cada imagen antes de publicarla.
