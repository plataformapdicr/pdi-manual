# Encargos para Codex

Los 16 capítulos de pantallas (C01 a C16) están escritos. Quedan tres encargos, en este orden. Cada uno se pega tal cual.

## Encargo 1: verificación cruzada de los capítulos de Claude (MN5.2)

```text
Trabaje en el repositorio ubicado en E:\APLICACIONES\RubricasApp.Web\.claude\worktrees\manual-usuario-d32f83 (rama claude/manual-usuario-d32f83).

Verifica contra el código los capítulos del manual de PDI que escribió otro agente: c01, c02, c03, c04, c08, c09, c11, c14 y c16, en DOCS/manual/capitulos/.

Lee primero DOCS/manual/GUIA_REDACCION.md y DOCS/manual/inventario.md (la sección de cada capítulo indica sus controladores y vistas).

Para cada capítulo, compara con las vistas (.cshtml) y los controladores reales:
1. Cada nombre dentro de <span class="boton">, <span class="campo">, <span class="ruta"> y <span class="valor"> existe en la vista con ese texto exacto.
2. Cada mensaje citado entre comillas latinas «» existe en el código con ese texto.
3. Cada permiso y cada rol que el capítulo exige coincide con los atributos del controlador y con las condiciones del menú (Views/Shared/_Layout.cshtml).
4. Los pasos siguen el orden real de la pantalla y no falta un paso obligatorio.
5. No se promete un efecto que el código no produce.

Reglas:
- NO modifiques los capítulos ni ningún otro archivo. Escribe un solo archivo nuevo: DOCS/manual/VERIFICACION_MN5.md.
- En ese archivo, una tabla por capítulo con: tarea (id), lo que dice el capítulo, lo que dice el código, archivo y línea del código, gravedad (Error: el texto es falso; Impreciso: nombre o detalle distinto; Menor). Si un capítulo no tiene hallazgos, dilo.
- Solo hallazgos comprobados en el código. No opines de estilo.
- No ejecutes la aplicación ni consultes la base de datos. No hagas commit. No escribas contraseñas ni credenciales.

Al terminar, entrega: cantidad de hallazgos por capítulo y por gravedad.
```

## Encargo 2: capítulos de cierre C17 y C18 (MN6)

```text
Trabaje en el repositorio ubicado en E:\APLICACIONES\RubricasApp.Web\.claude\worktrees\manual-usuario-d32f83 (rama claude/manual-usuario-d32f83).

Escribe dos capítulos del manual de usuario de PDI a partir de los capítulos ya escritos (DOCS/manual/capitulos/c01 a c16). No leas código para estos dos: todo sale de los capítulos.

Lee primero DOCS/manual/GUIA_REDACCION.md, DOCS/manual/glosario.md y DOCS/manual/capitulos/c01-vision-general.html (modelo de capítulo sin tareas: usa <section class="tema" id="..."> con <h2>, sin los siete apartados).

Capítulo C17 "Flujos de punta a punta", archivo DOCS/manual/capitulos/c17-flujos.html. Un tema por flujo, cada uno como lista numerada de pasos donde cada paso es una frase y un enlace a la tarea que lo explica (href="#id" de esa tarea). No repitas los pasos de las tareas. Flujos: poner en marcha una institución nueva; inicio de un curso lectivo; ingreso de un estudiante nuevo (empadronamiento, aprobación, matrícula); de la rúbrica a la nota (rúbrica, instrumento, evaluación, cuaderno calificador, reporte); cambio de sección; un día de clases (asistencia y boleta de conducta); cierre de período.

Capítulo C18 "Preguntas frecuentes y solución de problemas", archivo DOCS/manual/capitulos/c18-preguntas-frecuentes.html. Un tema por área (acceso y cuenta, permisos, matrícula, evaluación y notas, asistencia y conducta, reportes). Dentro, cada pregunta como <h3> y su respuesta en uno o dos párrafos con enlace a la tarea. Sácalas de los apartados "Errores frecuentes" de los capítulos: elige las 5 a 8 más útiles por área.

Reglas:
- Raíz de cada archivo: <section class="capitulo" id="c17" data-codigo="C17" data-titulo="..."> con un <h1> y <p class="resumen">. Los id de tema empiezan con c17- o c18-.
- Solo etiquetas y clases de la sección 4 de la guía. Cada enlace interno debe apuntar a un id que exista en los capítulos.
- Escribe solo esos dos archivos. No modifiques otros, salvo agregar líneas al final de DOCS/manual/PENDIENTE_CONFIRMAR.md.
- Español claro, trato de "usted", sin jerga técnica, sin emojis, UTF-8 sin BOM. No hagas commit.
- Al terminar ejecuta: node DOCS/manual/armar.cjs --solo-revisar  y corrige los ERRORES que señale en c17 y c18 (los avisos de otros capítulos no son tuyos).

Al terminar, entrega: los flujos y preguntas escritos y el resultado de armar.cjs.
```

## Encargo 3: glosario final C19 (MN6)

```text
Trabaje en el repositorio ubicado en E:\APLICACIONES\RubricasApp.Web\.claude\worktrees\manual-usuario-d32f83 (rama claude/manual-usuario-d32f83).

Escribe el capítulo C19 "Glosario" del manual de PDI, archivo DOCS/manual/capitulos/c19-glosario.html, a partir de DOCS/manual/glosario.md.

Lee DOCS/manual/GUIA_REDACCION.md y DOCS/manual/capitulos/c01-vision-general.html (modelo de capítulo con temas).

Forma: raíz <section class="capitulo" id="c19" data-codigo="C19" data-titulo="Glosario">, un <h1>, <p class="resumen">, y un <section class="tema" id="c19-..."> por cada grupo del glosario (los títulos de segundo nivel de glosario.md, menos "Cómo se añade un término"). Dentro de cada tema, una lista <dl> con <dt> término y <dd> definición, en orden alfabético. No incluyas la columna "No use": es para quienes escriben, no para el lector. Donde un término tenga una tarea que lo explique, agrega un enlace a ella dentro del <dd>.

Reglas: solo etiquetas y clases de la sección 4 de la guía; enlaces solo a id existentes; un solo archivo; español claro, trato de "usted", sin emojis, UTF-8 sin BOM; no hagas commit. Al terminar ejecuta node DOCS/manual/armar.cjs --solo-revisar y corrige los ERRORES de c19.
```

Después de cada encargo, la sesión principal corre `node DOCS/manual/armar.cjs` y revisa el resultado.
