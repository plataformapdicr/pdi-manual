# Verificación cruzada MN5.2

Fecha: 13/11/2026. Rama: `claude/manual-usuario-d32f83`.

Revisión estática de C01, C02, C03, C04, C08, C09, C11, C14 y C16 frente a las vistas, los controladores y los servicios que ejecutan sus operaciones. Se revisaron controles, citas, acceso, orden y efectos. Las rutas y etiquetas compuestas se contrastaron por sus componentes; los ejemplos ficticios y los marcadores de valores variables no se trataron como textos literales ausentes. Una coincidencia en otro módulo no se consideró prueba del recorrido descrito.

Corrección del 13/11/2026: se volvió a comprobar cada hallazgo contra el código y se ajustaron los ocho capítulos afectados. Se conserva lo que decía cada capítulo para dejar constancia de la diferencia original. No se modificó la aplicación, no se ejecutó y no se consultó la base de datos. La columna Estado indica la resolución en el manual; no significa que se hayan corregido defectos de PDI.

Gravedad: **Error** = afirmación o efecto falso, o paso obligatorio omitido que impide completar el recorrido; **Impreciso** = nombre, condición o alcance distinto; **Menor** = diferencia sin efecto en el procedimiento. Una fila equivale a un hallazgo; cuando una misma diferencia afecta varios apartados del capítulo se indica en esa fila.

## C01 — Visión general y mapa del sistema

| Tarea o tema (id) | Lo que decía el capítulo | Lo que dice el código | Archivo y línea del código | Gravedad | Estado |
|---|---|---|---|---|---|
| `c01-el-menu` | La tabla limita Configuración a cuatro roles y Evaluaciones a cinco roles; además dice que cada entrada de Configuración aparece solo con su permiso. | El encabezado Configuración se representa para toda sesión; su contenido se habilita a los cuatro roles o con `configuracion.ver`. Evaluaciones también se muestra con `evaluaciones.ver`. Dentro de Configuración hay entradas con condiciones distintas: Mis Grupos se muestra por rol, y Empadronamiento no tiene condición propia dentro del submenú Estudiantes. La tabla no representa todas esas condiciones. | `Views/Shared/_Layout.cshtml:611`, `:618`, `:714`, `:745`, `:960` | Impreciso | Corregido |
| `c01-panel-de-control`, `c01-instituciones-y-periodo` | Elegir el período del Panel de control hace que las evaluaciones se muestren según ese período. | El listado de evaluaciones solo limita por período cuando recibe el parámetro `periodoId`. No toma el período guardado en la sesión; su vista usa `ViewBag.PeriodoSeleccionado`, que se llena con ese parámetro. Cambiar el selector de sesión recarga la página, pero no añade ese filtro al listado. | `Controllers/EvaluacionesController.cs:64`, `:84`, `:119`; `Views/Evaluaciones/Index.cshtml:12`; `Views/Shared/Components/PeriodoAcademicoSelector/Default.cshtml:105` | Error | Corregido |

## C02 — Primeros pasos

| Tarea o tema (id) | Lo que decía el capítulo | Lo que dice el código | Archivo y línea del código | Gravedad | Estado |
|---|---|---|---|---|---|
| `c02-registrarse` | Al registrarse recibe el rol Observador. | Aunque la vista anuncia Observador, el formulario no ofrece una elección de rol y el guardado usa Evaluador cuando `SelectedRole` está vacío. El resultado descrito reproduce el aviso de la vista, pero contradice la operación. | `Views/Account/Register.cshtml:223`; `ViewModels/Account/AuthViewModels.cs:66`; `Controllers/AccountController.cs:1164` | Error | Corregido |
| `c02-elegir-periodo` | Las evaluaciones se muestran según el período elegido para la sesión. | El listado requiere su filtro propio `periodoId`; cambiar el período de sesión no establece ese parámetro. Es la misma diferencia encontrada en C01, repetida aquí como efecto de esta tarea. | `Controllers/EvaluacionesController.cs:64`, `:84`, `:119`; `Views/Evaluaciones/Index.cshtml:75`; `Views/Shared/Components/PeriodoAcademicoSelector/Default.cshtml:105` | Error | Corregido |
| `c02-instalar-celular` | Los datos no se guardan en el teléfono. | Existe al menos un almacenamiento de datos de formulario en el navegador: el borrador de empadronamiento se guarda en `localStorage`, también cuando se usa desde el teléfono. La necesidad de conexión para registrar la información no elimina ese guardado local. | `wwwroot/js/empadronamiento-multistep.js:713`, `:722`; `Views/Empadronamiento/Create.cshtml:195` | Error | Corregido |

## C03 — Roles, permisos y usuarios

| Tarea o tema (id) | Lo que decía el capítulo | Lo que dice el código | Archivo y línea del código | Gravedad | Estado |
|---|---|---|---|---|---|
| `c03-bloquear-eliminar` | La persona bloqueada no puede iniciar sesión hasta que se desbloquee. | Bloquear fija una fecha de fin un año después; el bloqueo puede vencer sin que se ejecute Desbloquear. La descripción omite esa duración. | `Controllers/AccountController.cs:640`, `:671` | Impreciso | Corregido |
| `c03-crear-rol` | Los cambios de permisos del rol se aplican a sus usuarios en su siguiente pantalla. | Editar el rol cambia sus permisos sin invalidar la caché de usuarios. La consulta del menú puede reutilizar permisos guardados durante cinco minutos. No está garantizado que se reflejen en la siguiente pantalla; el recorrido de Permisos sí tiene una invalidación expresa. | `Areas/Admin/Controllers/RolesController.cs:246`, `:270`; `Services/Permissions/UserPermissionCacheService.cs:10`, `:30`; contraste: `Areas/Admin/Controllers/PermissionsController.cs:464` | Error | Corregido |
| `c03-eliminar-rol` | El rechazo «Rol en Uso» se debe a que el rol está asignado a usuarios activos. | La eliminación consulta todos los usuarios del rol y bloquea si hay cualquiera, sin filtrar `Activo`. Una cuenta inactiva también impide borrarlo. La vista usa la palabra «activos», pero el guardado no aplica esa condición. | `Areas/Admin/Controllers/RolesController.cs:329`, `:330`; `Areas/Admin/Views/Roles/Delete.cshtml:46` | Impreciso | Corregido |
| `c03-matriz` | El archivo exportado conserva lo que se ve tras filtrar la matriz. | Los filtros ocultan filas solo en el navegador. Excel, CSV e Imprimir llaman a acciones sin parámetros de esos filtros y reconstruyen la matriz completa. | `Areas/Admin/Views/Permissions/Matrix.cshtml:16`, `:17`, `:18`, `:117`; `Areas/Admin/Controllers/PermissionsController.cs:682`, `:687`, `:785`, `:822` | Error | Corregido |

## C04 — Plataforma e instituciones

| Tarea o tema (id) | Lo que decía el capítulo | Lo que dice el código | Archivo y línea del código | Gravedad | Estado |
|---|---|---|---|---|---|
| Todas las tareas de C04 | Sin hallazgos comprobados en esta revisión. | Se contrastaron las acciones de plataforma, instituciones, solicitudes, ciclo de vida, selector de institución, slider y configuración con sus vistas y condiciones de acceso. | `Controllers/PlataformaController.cs:9`; `Controllers/InstitucionesController.cs:59`, `:186`, `:401`, `:454`, `:509`, `:577`; `Controllers/SliderController.cs:15`; `Areas/Admin/Controllers/ConfiguracionController.cs:23` | — | No aplica: no se detectaron hallazgos. |

## C08 — Empadronamiento

| Tarea o tema (id) | Lo que decía el capítulo | Lo que dice el código | Archivo y línea del código | Gravedad | Estado |
|---|---|---|---|---|---|
| `c08-crear` | El mismo recorrido cubre crear o editar y termina pulsando Finalizar Empadronamiento. | En creación el botón sí se llama Finalizar Empadronamiento. En edición se llama Guardar Empadronamiento; falta distinguir ese último control. | `Views/Empadronamiento/Create.cshtml:190`; `Views/Empadronamiento/Edit.cshtml:221` | Impreciso | Corregido |

## C09 — Matrícula

| Tarea o tema (id) | Lo que decía el capítulo | Lo que dice el código | Archivo y línea del código | Gravedad | Estado |
|---|---|---|---|---|---|
| `c09-configurar-cupos` | Solo se puede quitar un cupo si el nivel no tiene matrículas; si tiene matrículas, tampoco se cambian nivel, especialidad ni prefijo. | Las restricciones se comprueban sobre matrículas vigentes: Formalizada, En espera o Solicitada. Las matrículas cerradas no impiden esas operaciones. Debe precisarse «matrículas vigentes» para no presentar una restricción histórica absoluta. | `Services/Matriculas/ConfiguracionMatriculaService.cs:148`, `:150`, `:155`, `:180` | Impreciso | Corregido |

## C11 — Asistencia

| Tarea o tema (id) | Lo que decía el capítulo | Lo que dice el código | Archivo y línea del código | Gravedad | Estado |
|---|---|---|---|---|---|
| `c11-resumen-dia` | Imprimir el resumen exige `asistencia.imprimir`. | El botón documentado ejecuta `window.print()` y se muestra si hay registros, sin comprobar ese permiso. `asistencia.imprimir` se exige en otra acción, ImprimirResumen, que este botón no utiliza. | `Views/Asistencia/Resumen.cshtml:40`, `:42`; `Controllers/AsistenciaController.cs:471` | Error | Corregido |
| `c11-resumen-dia` | Cambiar Fecha y pulsar Ver permite revisar y corregir la asistencia del grupo de ese día. | Cuando existen varias materias o lecciones, la pantalla ofrece enlaces para elegir una. El resumen y Corregir corresponden solo a la elegida; por omisión se toma la primera. Falta explicar la elección de materia o lección para evitar revisar o corregir otra lista. | `Controllers/AsistenciaController.cs:401`, `:413`; `Views/Asistencia/Resumen.cshtml:83`, `:89`, `:31` | Impreciso | Corregido |

## C14 — Conducta

| Tarea o tema (id) | Lo que decía el capítulo | Lo que dice el código | Archivo y línea del código | Gravedad | Estado |
|---|---|---|---|---|---|
| `c14-programa` | Desde Nuevo programa, los pasos empiezan por escribir el título y la situación. | Antes hay que elegir Estudiante aplazado. Su elección determina además el período enviado; sin estudiante no puede crearse el programa. El paso sí puede venir resuelto al abrir desde una nota, pero no desde Nuevo programa. | `Views/ProgramaAcciones/Create.cshtml:31`, `:37`, `:43`; `Controllers/ProgramaAccionesController.cs:430` | Error | Corregido |
| `c14-programa` | Después de crearlo, el procedimiento pasa a Verificar sin indicar un cambio previo de estado. | El formulario crea con Estado Pendiente. Verificar solo admite En Proceso; para continuar debe editarse el programa y cambiar ese estado. El apartado de errores solo recomienda revisar el filtro, sin explicar esta operación necesaria. | `Views/ProgramaAcciones/Create.cshtml:104`; `Views/ProgramaAcciones/Edit.cshtml:33`, `:37`; `Controllers/ProgramaAccionesController.cs:344` | Error | Corregido |
| `c14-programa` | La verificación la hace la persona indicada en Supervisa. | El guardado comprueba acceso de escritura al programa y su estado, pero no exige que el usuario sea `ResponsableSupervisionId`. Registra como verificador al usuario de la sesión. El campo de supervisión no constituye esa restricción de acceso. | `Controllers/ProgramaAccionesController.cs:335`, `:344`, `:360`, `:364` | Error | Corregido |
| `c14-consultar-boletas`, `c14-nota-estudiante`, `c14-riesgo-aplazados` | La consulta se limita a los estudiantes de sus grupos y Quien puede hacerla se identifica solo con quien ve el menú Conducta. | Los controladores exigen sesión. El menú se limita a cuatro roles, pero no es el control de entrada. Para consultar, un coordinador también alcanza grupos con materias de las escuelas que coordina; administración tiene un alcance más amplio. Para escribir se aplica otro alcance. El capítulo no distingue esos accesos y presenta una consulta demasiado limitada. | `Controllers/BoletasConductaController.cs:16`, `:57`, `:62`; `Controllers/ProgramaAccionesController.cs:16`; `Services/Coordinacion/AlcanceCoordinacion.cs:34`; `Views/Shared/_Layout.cshtml:990` | Impreciso | Corregido |

## C16 — Auditoría

| Tarea o tema (id) | Lo que decía el capítulo | Lo que dice el código | Archivo y línea del código | Gravedad | Estado |
|---|---|---|---|---|---|
| `c16-exportar` | Sin filtros se exporta todo. | La exportación ordena por fecha descendente y limita a 50 000 registros, incluso sin filtros. La expresión «todo» no garantiza una copia completa cuando se supera ese límite. | `Areas/Admin/Controllers/AuditController.cs:388`, `:405`, `:406` | Error | Corregido |

## Recuento de hallazgos corregidos en el manual

| Capítulo | Error | Impreciso | Menor | Total |
|---|---:|---:|---:|---:|
| C01 | 1 | 1 | 0 | 2 |
| C02 | 3 | 0 | 0 | 3 |
| C03 | 2 | 2 | 0 | 4 |
| C04 | 0 | 0 | 0 | 0 |
| C08 | 0 | 1 | 0 | 1 |
| C09 | 0 | 1 | 0 | 1 |
| C11 | 1 | 1 | 0 | 2 |
| C14 | 3 | 1 | 0 | 4 |
| C16 | 1 | 0 | 0 | 1 |
| **Total** | **11** | **7** | **0** | **18** |

Los 18 hallazgos quedaron corregidos en el manual. No se descartó ninguno. C04 se conserva como comprobación sin hallazgos y no forma parte del total. Las repeticiones de la afirmación sobre el período de las evaluaciones cuentan una vez en C01 y una vez en C02. La contradicción del rol de registro público y la demora del menú tras editar un rol se anotaron al final de PENDIENTE_CONFIRMAR.md para su resolución en la aplicación, fuera de este encargo.
