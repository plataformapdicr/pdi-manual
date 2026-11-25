# Roadmap del manual de usuario de PDI

Creado el 2026-11-12. Objetivo: un manual en HTML que guíe sobre todo el sistema (RubricasApp.Web), escrito entre varios agentes sin que se pisen.

**Leyenda:** `[x]` hecho · `[~]` avanzado · `[ ]` pendiente. Tamaño: **S** (una sesión corta), **M** (una sesión larga), **L** (más de una sesión). Los códigos (MN1.2, C09…) son fijos.

**Quién:** **Claude** (sesión principal: decide estructura, integra y revisa) · **Codex** (capítulos de volumen con plantilla fija) · **Claude-S** (sesión aparte con modelo intermedio, para capítulos cortos y revisiones) · **Usted** (decisiones, capturas, visto bueno).

## Idea central

El manual no se escribe como un solo archivo. Cada capítulo es un archivo propio y un script los une en el HTML final. Así cada agente escribe un archivo que nadie más toca, y el costo se reparte: la lectura cara del código se hace una vez (el inventario) y los capítulos trabajan con contexto corto.

```
DOCS/manual/
  inventario.md          mapa menú -> pantallas -> permisos -> capítulo (MN1)
  GUIA_REDACCION.md      reglas de estilo y plantilla de capítulo (MN2)
  glosario.md            términos fijados antes de escribir (MN2)
  capitulos/c01-….html   un fragmento por capítulo (MN4), un solo autor cada uno
  plantilla.html         marco: índice lateral, buscador, temas, impresión (MN3)
  armar.cjs              une capítulos + plantilla, sin dependencias (MN3)
  manual-pdi.html        resultado; se genera, no se edita a mano
  PENDIENTE_CONFIRMAR.md dudas que el código no resuelve, con archivo de origen
```

## Reglas para todos los agentes

1. **Un archivo, un autor.** Cada agente escribe solo el capítulo que se le asignó y, si tiene dudas, agrega líneas a `PENDIENTE_CONFIRMAR.md`. No toca nada más del repositorio.
2. **El código manda.** Nombres de botones, campos y mensajes se copian de las vistas reales. Si un documento de `DOCS/` contradice al código, vale el código (el README menciona SQLite; la base es SQL Server).
3. **No inventar.** Lo que no se pueda confirmar va a `PENDIENTE_CONFIRMAR.md`, no al manual.
4. **Sin credenciales.** Ni contraseñas, ni cadenas de conexión, ni los usuarios de prueba de la pantalla de inicio de sesión.
5. **Solo lectura sobre la base.** Nadie ejecuta scripts ni cambia datos para escribir el manual.
6. **Sin commit ni push** salvo que usted lo pida.
7. **Estilo:** español claro, trato de "usted", sin jerga técnica, sin emojis, UTF-8 sin BOM.
8. **Quien escribe no se revisa.** Cada capítulo lo verifica un agente distinto del que lo escribió (MN5).

## Orden y dependencias

```
MN0 Decisiones
 └─ MN1 Inventario
     └─ MN2 Contrato (guía, plantilla, glosario, capítulo modelo)
         ├─ MN3 Marco HTML y script de armado ──────────┐
         └─ MN4 Capítulos (en paralelo, tres carriles) ─┤
                 └─ MN5 Verificación cruzada ───────────┤
                                                        ├─ MN6 Flujos, FAQ y glosario final
                                                        └─ MN7 Integración y revisión en navegador
                                                             └─ MN8 Capturas y entrega
MN9 Mantenimiento (continuo)
```

MN3 y MN4 avanzan a la vez. Dentro de MN4 los tres carriles no dependen entre sí.

## Dónde estamos

| Bloque | Estado | Quién |
|---|---|---|
| MN0 | Hecho (MN0.4 se cierra al lanzar Codex) | Usted |
| MN1 | Hecho | Claude y Usted |
| MN2 | Hecho: guía, glosario base, capítulo modelo C09 y 13 encargos (en `DOCS/manual/encargos/`) | Claude |
| MN3 | Hecho: `plantilla.html` (con /impeccable), `armar.cjs` con comprobaciones, `PRODUCT.md` y `DESIGN.md` en `DOCS/manual/` | Claude |
| MN4 | Hecho: los 16 capítulos de pantallas están escritos (C01 a C16). C07, C10 y C12 se escribieron mientras otra sesión editaba sus vistas | Codex, Claude-S, Claude |
| MN5 | MN5.2 y MN5.3 hechas; MN5.1 hecha en nombres y permisos, falta el orden de los pasos (se confirma en MN7.3); falta MN5.4 | Cruzado; MN5.2 por Codex |
| MN6 | C17, C18 y C19 escritos; los 19 capítulos están disponibles para revisión e integración | Codex; revisión por Claude |
| MN7 | Manual regenerado: 19 capítulos, 158 tareas, sin errores y con 3 avisos; falta la revisión integral | Claude y Codex |
| MN8 | MN8.1, MN8.2 y MN8.3 hechas (78 de 78 capturas); falta MN8.4 | Usted y Claude |
| MN10 | 41 mejoras a la aplicación detectadas al escribir y recorrer el manual; ninguna aplicada | Usted decide; sesión aparte |

**Siguiente paso:** completar MN7.3 con una cuenta de profesor y una institución anual (ver `VERIFICACION_MN7_3.md`); MN7.2, lectura de corrido; MN5.4, cerrar `PENDIENTE_CONFIRMAR.md` con las respuestas del usuario y la matriz de roles; MN8, capturas. Decidir qué mejoras de MN10 se corrigen. Para ver el estado: `node DOCS/manual/armar.cjs`. Commit de partida: `99560da0a3`.

## MN0 Decisiones (Usted)

| | Tarea | Tam. |
|---|---|---|
| [x] | **MN0.1** Alcance: el portal del estudiante (repositorio `RubricasWebEstudiante`) va en un manual aparte; aquí solo un capítulo corto que lo presenta. Decidido el 2026-11-12. | S |
| [x] | **MN0.2** Lector principal de la primera versión: usted (guía completa). Administradores y docentes vienen después. Decidido el 2026-11-12. | S |
| [x] | **MN0.3** Capturas de pantalla: sin capturas en la primera versión (recuadros con la descripción); se agregan en MN8. Decidido el 2026-11-12. | S |
| [~] | **MN0.4** Acceso de Codex: usted le indicará dónde están los archivos cuando se lancen sus capítulos. Cada encargo de Codex debe decir la carpeta de trabajo y que solo escribe en `DOCS/manual/capitulos/`. | S |

## MN1 Inventario (Claude)

La lectura cara se hace una sola vez y queda escrita, para que ningún agente de capítulo tenga que recorrer todo el código.

| | Tarea | Tam. |
|---|---|---|
| [x] | ~~**MN1.1** Recorrer el menú (`Views/Shared/_Layout.cshtml`, `Areas/Admin`) y listar cada entrada: controlador, acción, texto visible.~~ 78 entradas. | M |
| [x] | ~~**MN1.2** Por pantalla: vistas que usa, permiso que exige (`ApplicationPermissions.cs`), roles que lo tienen por defecto (`PermissionService`).~~ El código solo siembra SuperAdmin; el resto está en la base (ver `PENDIENTE_CONFIRMAR.md`, punto 1). | M |
| [x] | ~~**MN1.3** Detectar pantallas que existen en el código pero no están en el menú, y documentos de `DOCS/` aprovechables por capítulo (hay manuales previos de empadronamiento, conducta y asistencia).~~ | S |
| [x] | ~~**MN1.4** Escribir `DOCS/manual/inventario.md`: una tabla por capítulo con pantalla, ruta, archivos fuente, permiso y documento de apoyo.~~ Verificado: 78 entradas de menú, 224 permisos y 64 controladores presentes. | S |
| [x] | **MN1.5** Su visto bueno al índice de capítulos, con los cambios de `inventario.md`. Dado el 2026-11-12 ("ok dale"); las cinco preguntas abiertas siguen en `PENDIENTE_CONFIRMAR.md`. | S |

## MN2 Contrato de redacción (Claude)

| | Tarea | Tam. |
|---|---|---|
| [x] | **MN2.1** `GUIA_REDACCION.md`: estructura fija de capítulo y de tarea, etiquetas HTML y clases permitidas, cómo enlazar a otro capítulo, cómo marcar el lugar de una captura. | S |
| [x] | **MN2.2** `glosario.md` base: términos del dominio con una sola forma aceptada (sección o grupo, período, matrícula, empadronamiento, rúbrica, instrumento, ítem…). | S |
| [x] | **MN2.3** Capítulo modelo completo: **C09 Matrícula**. Sirve de ejemplo para los demás agentes. | M |
| [x] | **MN2.4** Encargo listo para pegar, uno por capítulo, generado desde el inventario (ver "Encargo para un agente de capítulo"). | S |

Estructura fija de cada tarea dentro de un capítulo:

1. Para qué sirve.
2. Quién puede hacerla (permiso y roles).
3. Dónde está (ruta en el menú).
4. Pasos numerados, con el nombre exacto de cada botón y campo.
5. Qué pasa después.
6. Errores frecuentes y qué hacer.
7. Tareas relacionadas (enlaces).

## MN3 Marco HTML y armado (Claude)

| | Tarea | Tam. |
|---|---|---|
| [x] | **MN3.1** `plantilla.html`: índice lateral fijo, buscador por texto, tema claro y oscuro, lectura en celular, impresión limpia. Pasa por `/impeccable` y usa colores y tipografía de `wwwroot/css`. | M |
| [x] | **MN3.2** `armar.cjs` (Node, sin dependencias): une los capítulos en orden, genera el índice y los anclajes, incrusta CSS y JS, y produce un solo `manual-pdi.html` que abre sin conexión. | S |
| [x] | **MN3.3** Comprobaciones dentro de `armar.cjs`: enlaces internos rotos, capítulos faltantes, etiquetas no permitidas, términos fuera del glosario. Falla con lista clara. | S |

## MN4 Capítulos (en paralelo)

Tres carriles. Cada capítulo es un archivo en `DOCS/manual/capitulos/`.

**Carril Claude** (necesitan criterio sobre todo el sistema):

| | Capítulo | Pantallas principales | Tam. |
|---|---|---|---|
| [x] | **C01** Visión general y mapa del sistema | Portada, panel de control | S |
| [x] | **C03** Roles, permisos y usuarios | Admin, ManageUsers, Invitaciones | M |
| [x] | **C09** Matrícula (capítulo modelo, MN2.3) | Matricula, Configuracion, Carreras y planes | M |

**Carril Codex** (volumen, muchas pantallas parecidas, plantilla fija):

| | Capítulo | Pantallas principales | Tam. |
|---|---|---|---|
| [x] | **C05** Estructura académica (Codex, 2026-11-12; pasó `armar.cjs` sin errores; falta la verificación cruzada MN5.1) | PeriodosAcademicos, Materias, TiposGrupo, Facultades, Escuelas, TiposFormacionAcademica | M |
| [x] | **C06** Profesores (Codex, 2026-11-12; pasó `armar.cjs` sin errores; falta la verificación cruzada MN5.1) | Profesores, currículum, ProfesorGuia, MisGrupos | M |
| [x] | **C07** Estudiantes y grupos (Codex, 2026-11-13; pasó `armar.cjs` sin errores; se escribió mientras otra sesión editaba esas vistas: reverificar antes de MN7) | Estudiantes, GruposEstudiantes | M |
| [x] | **C10** Horarios (Codex, 2026-11-13; pasó `armar.cjs` sin errores; reverificar antes de MN7) | Horarios | S |
| [x] | **C12** Rúbricas e instrumentos (Codex, 2026-11-13; pasó `armar.cjs` sin errores; reverificar antes de MN7) | Rubricas, NivelesCalificacion, ItemsEvaluacion, ValorRubrica, InstrumentosEvaluacion, InstrumentoRubrica, InstrumentoMaterias | L |
| [x] | **C13** Evaluaciones y cuaderno calificador (Codex, 2026-11-12; pasó `armar.cjs` sin errores; falta la verificación cruzada MN5.1) | Evaluaciones, CuadernoCalificador, SEA | L |
| [x] | **C15** Reportes y exportaciones (Codex, 2026-11-12; pasó `armar.cjs` sin errores; falta la verificación cruzada MN5.1) | Reportes, ReportesGestion, ReporteCoordinacion, Exportaciones | M |

**Carril Claude-S** (cortos o con documento previo que adaptar):

| | Capítulo | Pantallas principales | Tam. |
|---|---|---|---|
| [x] | **C02** Primeros pasos (lo escribió Claude el 2026-11-12, a pedido del usuario, en lugar de Claude-S) | Login, registro, recuperar contraseña, invitación, solicitud de institución, perfil, contraseña, institución activa, período de trabajo, accesibilidad, instalar en el celular, acceso denegado | S |
| [x] | **C04** Plataforma e instituciones (lo escribió Claude el 2026-11-12, a pedido del usuario) | Plataforma, Instituciones, Solicitudes, Slider | M |
| [x] | **C08** Empadronamiento (lo escribió Claude el 2026-11-13, a pedido del usuario) | Empadronamiento, EmpadronamientoPublico, Aprobaciones (hay manual previo) | M |
| [x] | **C11** Asistencia (lo escribió Claude el 2026-11-13, a pedido del usuario) | Asistencia, AsistenciaLeccion, Ausencias, Estadisticas | M |
| [x] | **C14** Conducta (lo escribió Claude el 2026-11-13, a pedido del usuario) | BoletasConducta, NotaConducta, ProgramaAcciones (hay documento previo) | M |
| [x] | **C16** Auditoría (lo escribió Claude el 2026-11-12, a pedido del usuario) | Auditoria | S |

Los capítulos C17 a C19 se escriben en MN6, cuando los demás existen.

## MN5 Verificación cruzada

Cada capítulo lo revisa un agente distinto del autor, contra el código y no contra el texto.

| | Tarea | Quién | Tam. |
|---|---|---|---|
| [~] | **MN5.1** Capítulos de Codex: comprobar cada nombre de botón, campo y permiso contra las vistas.  Hecho por Claude el 2026-11-13 lo comprobable por texto: 1781 nombres y mensajes de C05, C06, C07, C10, C12, C13 y C15 existen en el código (11 diferencias, ninguna es error) y ningún permiso nombrado carece de respaldo. Detalle en `DOCS/manual/VERIFICACION_MN5_1.md`. Falta confirmar el orden de los pasos y los efectos, que se hace al recorrer la aplicación (MN7.3). | Claude-S | M |
| [x] | **MN5.2** Capítulos de Claude y Claude-S: comprobación cruzada y corrección de los 18 hallazgos en los ocho capítulos afectados. Estado por hallazgo en `DOCS/manual/VERIFICACION_MN5.md`; completada el 2026-11-13. | Codex | M |
| [x] | **MN5.3** Cobertura: cada entrada del menú y cada permiso de `ApplicationPermissions.cs` aparece en algún capítulo. Se compara contra `inventario.md`.  Hecho el 2026-11-13: las 73 entradas del menú con texto se mencionan en algún capítulo. De 125 permisos en uso, 107 se nombran; los 18 restantes no se nombran a propósito: 11 protegen acciones sin pantalla o sin botón (MN10.10, MN10.16, MN10.18, MN10.19 y exportar asistencia), y 7 solo afinan lo que se ve dentro de una pantalla ya documentada (`rubricas.crear`, `reportes.ver_avanzados`, `reportes.ver_todos`, `configuracion.editar_seguridad`, `configuracion.ver_logs`, `auditoria.ver_metricas`, `admin.ver_dashboard`). | Claude | S |
| [ ] | **MN5.4** Resolver `PENDIENTE_CONFIRMAR.md`: lo que el código aclare se corrige; el resto se le pregunta a usted. | Claude y Usted | S |

El revisor entrega una lista de hallazgos con archivo y línea de la vista; no reescribe el capítulo. El autor original (o Claude) aplica las correcciones.

## MN6 Capítulos transversales (Claude)

| | Tarea | Tam. |
|---|---|---|
| [x] | **C17** (Codex, 2026-11-13) Flujos de punta a punta: inicio de año lectivo, de la rúbrica a la nota, matrícula de un estudiante nuevo, cambio de sección, cierre de período. Enlazan a los capítulos, no repiten pasos. | M |
| [x] | **C18** (Codex, 2026-11-13; Claude agregó 2 preguntas) Preguntas frecuentes y solución de problemas, a partir de los "errores frecuentes" de cada capítulo. | S |
| [x] | **C19** (Codex, 2026-11-13) Glosario final, desde `glosario.md`. | S |

## MN7 Integración y revisión (Claude)

| | Tarea | Tam. |
|---|---|---|
| [x] | **MN7.1** Armar `manual-pdi.html` y dejar `armar.cjs` sin errores. | S |
| [ ] | **MN7.2** Lectura completa de corrido: tono parejo, términos del glosario, repeticiones entre capítulos. | M |
| [~] | **MN7.3** Revisión en navegador: índice, buscador, enlaces, celular, tema oscuro, impresión.  Primera pasada hecha el 2026-11-13 como Super Administrador, en solo lectura (detalle y lo que falta en `DOCS/manual/VERIFICACION_MN7_3.md`). Falta: vista de profesor y de administrador de institución, una institución anual, y un recorrido que guarde datos en una base de pruebas.  Segunda pasada hecha el 2026-11-13 como Profesor (solo lectura): ver `DOCS/manual/VERIFICACION_MN7_3.md`, sección "Recorrido como profesor". Falta una institución anual y un recorrido que guarde datos en una base de pruebas. | S |
| [ ] | **MN7.4** Informe final: lo cubierto, lo pendiente de confirmar y las pantallas sin menú. | S |

## MN8 Capturas y entrega

| | Tarea | Quién | Tam. |
|---|---|---|---|
| [x] | **MN8.1** Lista de capturas necesarias, sacada de los recuadros de los capítulos.  La genera `armar.cjs` en `DOCS/manual/capturas.md` en cada armado. | Claude | S |
| [x] | **MN8.2** Tomar las capturas con datos de demostración (requiere su sesión iniciada; el servidor de desarrollo solo vive mientras el agente trabaja).  Herramienta lista: `node DOCS/manual/tomar-capturas.cjs` abre Chrome, el usuario inicia sesión, y el asistente recorre las 78 capturas (navega a la pantalla, muestra qué debe verse y guarda `capturas/<código>.jpg` con Enter). 2026-11-14: Claude tomó 63 de 78 con Playwright sin ventana, con la sesión del usuario y la institución «Colegio Piloto Ficticio». Antes de cada captura se reemplazan en la página el nombre y el correo del usuario, cualquier correo, cédula o teléfono, y los nombres de personas en el contenido; las 63 se revisaron a ojo y ninguna muestra datos personales. Faltan 15 porque esa institución no tiene datos: c05-04, c05-06, c05-07 (escuelas y materias), c06-01, c06-03, c06-04, c06-05 (ficha y pasos del profesor), c07-07, c07-08 (detalle de grupo), c09-04, c09-05 (detalle de matrícula), c12-04, c12-06 (rúbrica), c13-01, c13-02 (detalle de evaluación). Ese mismo día, con permiso del usuario, se tomaron de instituciones con datos (Universidad de Costa Rica para 13, Universidad Piloto Ficticia para c09-04 y c09-05) con `capturar-auto.cjs auto "" --extra`. El filtro cambia el nombre de las instituciones reales por «Institución de Ejemplo» y reconoce nombres de persona con una lista de nombres y apellidos frecuentes, incluido el formato «Apellidos, Nombre». Las 15 se revisaron a ojo. 78 de 78. 2026-11-24: master reorganizó el menú (menús Estudiantes, Evaluación y Administración; Configuración solo con catálogos; textos en minúscula inicial). Se actualizaron 182 rutas y las etiquetas de menú en los capítulos, se reescribió la tabla de menús de C01 y se rehicieron las 78 capturas con la barra nueva. Las tres entradas nuevas quedaron documentadas el mismo día: Historial de asistencias (tarea c11-historial ampliada), Tipos de institución (c04-tipos-institucion, captura c04-03) y Portal estudiantil (c07-portal, captura c07-09). 160 tareas, 80 capturas. | Usted y Claude | M |
| [x] | **MN8.3** Incrustar las capturas y rearmar.  Hecho: `armar.cjs` incrusta cada `capturas/<código>.jpg` (o .png) en su lugar y deja el recuadro donde falta; `capturas.md` marca las hechas. | Claude | S |
| [ ] | **MN8.4** Su lectura y visto bueno. Decidir si el manual se enlaza desde la aplicación. | Usted | S |

## MN9 Mantenimiento

| | Tarea | Quién |
|---|---|---|
| [ ] | **MN9.1** Regla en `AGENTS.md`: todo cambio que altere una pantalla actualiza su capítulo y se rearma el manual. | Claude |
| [x] | **MN9.2** `armar.cjs` avisa si una vista cambió después que su capítulo (por fecha de git).  Compara contra los commits de la rama de esta carpeta; no ve cambios sin fusionar de otras ramas. | Claude |

## MN10 Mejoras a la aplicación detectadas al escribir el manual

Al leer el código para escribir los capítulos aparecieron defectos y huecos de la aplicación. No son tareas del manual: el manual describe lo que hay y cada capítulo evita prometer lo que no funciona. Se listan aquí para decidir cuáles se corrigen. El detalle y el archivo de origen de cada una están en `DOCS/manual/PENDIENTE_CONFIRMAR.md` (columna "Punto").

Reglas de este bloque:

- Ninguna se corrige desde la sesión del manual: tocan controladores, servicios y vistas que otra sesión está editando. Cada una va a una sesión aparte, con su prueba.
- "Verificado" significa que Claude leyó el código y confirmó lo descrito. "Reportado" significa que lo señaló Codex y no se ha comprobado.
- Al corregir una, se actualiza su capítulo y se rearma el manual (MN9.1).

### Prioridad alta: afectan notas, datos o acceso

| | Mejora | Punto | Capítulo | Estado |
|---|---|---|---|---|
| [ ] | **MN10.41** Conducta con una cuenta de profesor: el Dashboard muestra «Error al cargar el dashboard», el Registro de Boletas muestra el error técnico completo en pantalla, y Historial por Estudiante y Reporte General redirigen al Dashboard. La consulta de grupos del profesor no se puede traducir a SQL (`NotaConductaController.cs`, línea 118). **Verificado en la aplicación corriendo el 2026-11-13.** Prioridad más alta: bloquea el uso del módulo por profesores y expone un mensaje interno. | Verificado en pantalla | C14 |
| [ ] | **MN10.1** Cuaderno calificador: excluir las evaluaciones en borrador. Hoy entra toda evaluación que tenga puntos, sin mirar su estado. | 25 | C13 | Verificado |
| [ ] | **MN10.2** Cuaderno calificador: confirmar la escala de la nota. El cálculo usa los puntos de la rúbrica tal cual y aprueba desde 70; si una rúbrica no suma 100, la nota sale mal. Decidir si se convierte al porcentaje del máximo. | 25 | C13 | Verificado el cálculo; falta confirmar la escala de las rúbricas en uso |
| [ ] | **MN10.3** Cuaderno calificador: limitar los estudiantes a los grupos de la materia. Hoy carga todos los estudiantes del período. | 26 | C13 | Verificado |
| [ ] | **MN10.4** Reportes de gestión: filtrar las evaluaciones por período. Hoy se cargan por estudiante y rúbrica sin período ni fecha, y una rúbrica reutilizada mezcla períodos en avance, alertas y comparativo. | 23 | C15 | Verificado |
| [ ] | **MN10.5** Pantallas que solo piden sesión: Profesores, Rúbricas, Evaluaciones, Horarios, asistencia por lección, Conducta y Reportes no revisan permisos; solo el menú las oculta. Agregar `[RequirePermission]`. Comprobado en pantalla: una cuenta de profesor, que no ve el menú Profesores, abre `/Profesores` sin problema. | 7 | C06, C12, C13, C14, C15 | Verificado en código y en pantalla |
| [ ] | **MN10.6** Contraseña temporal a la vista: al crear un usuario, si el correo falla, el mensaje muestra la contraseña. Decidir otro mecanismo. | 13 | C03 | Verificado |
| [ ] | **MN10.7** Profesor guía desde el alta de profesor: el paso 6 permite asignar guía sin validar que el grupo ya tenga uno ni restringir roles, a diferencia de la pantalla Profesores Guía. | 29 | C06 | Reportado |

### Prioridad media: pantallas o botones que no hacen lo que dicen

| | Mejora | Punto | Capítulo | Estado |
|---|---|---|---|---|
| [ ] | **MN10.8** El rol Administrador ve "Panel de Administración" en el menú, pero el área exige Super Administrador. Ocultar la entrada o abrir el acceso. | 2 | C03 | Verificado |
| [ ] | **MN10.9** "Valores de Rúbricas": el menú la muestra con `niveles.ver` y la pantalla exige `rubricas.ver`. Alinear. | 8 | C12 | Verificado |
| [ ] | **MN10.10** Reporte SEA: la exportación a PDF no está implementada (lanza error de "pendiente"). Implementarla o quitar la acción y el permiso `sea.exportar_pdf`. | 24 | C13 | Verificado |
| [ ] | **MN10.11** Calidad de los datos: el enlace de "instrumentos sin rúbrica" apunta a `Instrumentos/Details`, que no existe. Debe ir a `InstrumentosEvaluacion`. | 22 | C15 | Verificado |
| [ ] | **MN10.12** Ficha del profesor: el botón "Eliminar definitivamente" no elimina, lleva a la pantalla de confirmación; y "Ver Opción Desactivar" lleva a una ficha que ya no tiene el control de desactivar. Renombrar o reconectar. | 27 | C06 | Verificado lo primero; lo segundo reportado |
| [ ] | **MN10.13** Alta de profesor, paso 6: la casilla "Profesor activo" no se respeta; siempre se crea activo. Respetarla o quitarla. | 28 | C06 | Reportado |
| [ ] | **MN10.14** Alta de profesor: Residencia y Dimex se ofrecen como tipo de cédula, pero el campo solo admite nueve dígitos. | 31 | C06 | Reportado |
| [ ] | **MN10.15** Tipos de formación: si se desactivan todos, el alta de profesor repone ocho opciones fijas en lugar de quedar vacía. | 30 | C06 | Reportado |
| [ ] | **MN10.16** Períodos académicos: Activar y Cerrar existen como acciones con permiso propio, pero ninguna pantalla tiene el botón. | 17 | C05 | Reportado |
| [ ] | **MN10.17** Eliminar usuario se comporta distinto en las dos pantallas: una borra la cuenta y la otra solo la desactiva. Unificar o nombrar distinto. | 14 | C03 | Verificado |

### Estudiantes y grupos (C07): reportadas por Codex el 2026-11-13

Ninguna está comprobada por Claude. Otra sesión está editando las vistas de Estudiantes y Grupos: antes de corregir, confirmar que el problema sigue en la versión fusionada.

| | Mejora | Punto | Capítulo | Estado |
|---|---|---|---|---|
| [ ] | **MN10.22** Alta y edición de estudiante: el formulario envía campos que el guardado no admite (año, activo, tipo de adecuación), y la casilla de estado en Editar usa otro nombre de campo. El alta puede fallar o no guardar esos datos. Prioridad alta si se confirma. | 34 | C07 | Reportado |
| [ ] | **MN10.23** Importar estudiantes desde Excel: "Validar Archivo" muestra éxito sin revisar nada; las instrucciones dicen cinco columnas y se leen seis; los errores por fila pueden no mostrarse; arrastrar el archivo no lo carga. Prioridad alta si se confirma. | 36 | C07 | Reportado |
| [ ] | **MN10.24** Editar grupo ofrece estado, período y materias como editables, pero no los guarda. | 37 | C07 | Reportado |
| [ ] | **MN10.25** Asignar y quitar estudiantes de un grupo, y exportar sus estudiantes: varias acciones solo piden sesión aunque la pantalla exige permiso. | 38 | C07 | Reportado |
| [ ] | **MN10.26** Eliminar grupo: la confirmación anuncia borrado permanente, pero el grupo solo queda inactivo y se rechaza si tiene estudiantes. Ajustar el texto. | 39 | C07 | Reportado |
| [ ] | **MN10.27** Lista de grupos: el filtro por tipo de grupo compara valores distintos y "Todos los períodos" vuelve al período de trabajo. | 40 | C07 | Reportado |
| [ ] | **MN10.28** Estadísticas de grupos: "Estudiantes asignados" cuenta a todos los del período y no se limita a los grupos propios del profesor. | 41 | C07 | Reportado |
| [ ] | **MN10.29** Adecuación del estudiante: "Configuración Detallada por Instrumento" solo abre un aviso de función futura, y los avisos de la pantalla prometen efectos que el guardado no aplica. | 35 | C07 | Reportado |

### Horarios (C10) y rúbricas (C12): reportadas por Codex el 2026-11-13

Ninguna está comprobada por Claude. Otra sesión está editando las vistas de Horarios, Rúbricas, Ítems, Valores y Niveles: antes de corregir, confirmar que el problema sigue en la versión fusionada.

| | Mejora | Punto | Capítulo | Estado |
|---|---|---|---|---|
| [ ] | **MN10.30** Eliminar un ítem de evaluación borra primero sus puntos y luego el ítem; si lo segundo falla, los puntos ya se perdieron. Hacerlo en una sola operación. Prioridad alta si se confirma. | 58 | C12 | Reportado |
| [ ] | **MN10.31** Editar un ítem de evaluación pone su peso en 0 y permite cambiarlo de rúbrica sin revisar sus puntos. Prioridad alta si se confirma. | 57 | C12 | Reportado |
| [ ] | **MN10.32** Editar un nivel de calificación lo saca de su grupo de calificación; y la regla de nombre único puede impedir editar copias. Prioridad alta si se confirma. | 56 | C12 | Reportado |
| [ ] | **MN10.33** Cambiar los niveles de un grupo de calificación o de una rúbrica no actualiza los puntos ya cargados de las rúbricas que lo usan. | 54 | C12 | Reportado |
| [ ] | **MN10.34** Crear grupo de calificación "rápido" solo pide sesión, no evita nombres repetidos y se lleva niveles de otros grupos. | 55 | C12 | Reportado |
| [ ] | **MN10.35** Importar rúbricas: la guía de la plantilla no coincide con lo que acepta el sistema (encabezados y celdas numéricas) y los errores de importación no se muestran en pantalla. | 59 | C12 | Reportado |
| [ ] | **MN10.36** Puntos de rúbrica: los editores usan límites distintos (0 a 100 en unos, hasta 999,99 en otros) y "Limpiar" no borra lo ya guardado en una de las pantallas. | 60 | C12 | Reportado |
| [ ] | **MN10.37** Pantallas de instrumentos sin enlace de entrada: InstrumentoRubrica/ByRubrica, InstrumentoMaterias/Details y la acción AsignarMateria. | 61 | C12 | Reportado |
| [ ] | **MN10.38** Horarios: los mensajes de guardado (éxito, error, conflictos) no se muestran en las vistas. | 50 | C10 | Reportado |
| [ ] | **MN10.39** Horarios: reactivar una lección no revisa conflictos; y un error al consultar conflictos se muestra como "sin conflictos". | 49, 52 | C10 | Reportado |
| [ ] | **MN10.40** Horarios: la casilla "Lección activa" del formulario no se respeta; "Eliminar" dice que no se puede deshacer pero solo desactiva; el contador de asistencias del detalle siempre da cero. | 47, 48, 51 | C10 | Reportado |

### Prioridad baja: limpieza

| | Mejora | Punto | Capítulo | Estado |
|---|---|---|---|---|
| [ ] | **MN10.18** Acciones sin vista ni enlace: Ofertas, CrearOferta, CerrarOferta y GestionarCalendario de períodos. Terminarlas o retirarlas. | 4, 16 | C05 | Verificado |
| [ ] | **MN10.19** "Estado del sistema" del panel de administración devuelve datos técnicos sin formato; y el modo mantenimiento existe sin control en pantalla. | 18, 20 | C04 | Verificado |
| [ ] | **MN10.20** 99 de 224 permisos no se exigen en ninguna pantalla. Retirarlos de la matriz o conectarlos. | 11 | C03 | Verificado |
| [ ] | **MN10.21** Código sin uso: controlador `Asistencias` (módulo anterior), vistas huérfanas y archivos `-bk`. | 3, 12 | C11 | Verificado |

Recomendación de orden: MN10.1 a MN10.4 primero, porque cambian notas y reportes que ya se usan; luego MN10.5 y MN10.6, que son de acceso.

## Encargo para un agente de capítulo

Texto base de MN2.4. Se completa con los datos del inventario y se pega tal cual en Codex o en una sesión aparte.

```text
Escribe el capítulo <CÓDIGO> "<TÍTULO>" del manual de usuario de PDI.

Lee primero, en este orden:
1. DOCS/manual/GUIA_REDACCION.md (estructura y etiquetas permitidas; es obligatoria).
2. DOCS/manual/glosario.md (usa solo estos términos).
3. DOCS/manual/capitulos/c09-matricula.html (capítulo modelo: imita su forma).
4. La sección de tu capítulo en DOCS/manual/inventario.md: lista las pantallas, los archivos fuente y los permisos.

Luego lee los archivos fuente que indica el inventario (controladores y vistas) y escribe el capítulo.

Reglas:
- Escribe un solo archivo: DOCS/manual/capitulos/<archivo>.html. No modifiques ningún otro archivo, salvo agregar líneas a DOCS/manual/PENDIENTE_CONFIRMAR.md.
- Los nombres de botones, campos y mensajes se copian de las vistas. Si algo no se puede confirmar en el código, no lo escribas: anótalo en PENDIENTE_CONFIRMAR.md con el archivo donde surgió la duda.
- No escribas contraseñas ni credenciales. No ejecutes la aplicación ni consultes la base de datos. No hagas commit.
- Español claro, trato de "usted", sin jerga técnica, sin emojis.

Al terminar, entrega: las tareas que documentaste, las pantallas del inventario que no cubriste y por qué, y lo que agregaste a PENDIENTE_CONFIRMAR.md.
```

## Costo y por qué este reparto

- El código que hay que leer ronda 6,5 MB. Un solo agente escribiendo todo relee ese contexto en cada paso. Con el inventario, cada capítulo lee solo sus archivos.
- Los capítulos de volumen (C12, C13, C15) van a Codex porque son muchas pantallas con la misma forma: plantilla fija y poco criterio.
- Los capítulos que cruzan módulos (C01, C03, C09, C17) se quedan en la sesión principal, que es la que tiene el mapa completo.
- La verificación cruzada cuesta poco (solo compara textos contra vistas) y es lo que evita un manual con botones que no existen.

## Riesgos

| Riesgo | Cómo se controla |
|---|---|
| Dos agentes editan el mismo archivo | Regla 1: un archivo, un autor. El armado es el único que toca `manual-pdi.html`. |
| Capítulos con tono o términos distintos | Guía, glosario y capítulo modelo antes de MN4; lectura de corrido en MN7.2. |
| Botones o permisos inventados | Regla 3 y verificación cruzada (MN5). |
| El sistema cambia mientras se escribe | El inventario registra el commit de partida; MN9.2 detecta vistas más nuevas que su capítulo. |
| Otra sesión está cambiando vistas (Rúbricas, Estudiantes, Grupos…) | Esos capítulos (C07, C12) se escriben al final de MN4 y se verifican justo antes de MN7. |
