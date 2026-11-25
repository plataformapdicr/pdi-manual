# Recorrido en la aplicación (MN7.3)

Hecho el 2026-11-13 por Claude con la sesión de un Super Administrador, sobre la aplicación corriendo desde este worktree (`http://localhost:18164`), primero sin institución elegida y después como «Universidad de Costa Rica». Solo lectura: no se guardó, creó ni borró nada.

## Qué se hizo

1. Se abrieron 114 pantallas sin institución y 122 con institución (listas, pantallas de crear, fichas de detalle y de edición, reportes, administración). Todas cargaron bien; la única dirección con error (`/Admin/Permissions/SyncPage`) era una que se había adivinado mal: el botón real es `Sincronizar`, que va a `/Admin/Permissions/Sync`.
2. Se comparó cada botón y campo citado por los capítulos con el texto que muestra cada pantalla (385 citas en la primera pasada, 93 en la segunda).
3. Se probaron a mano pantallas con datos: asistencia por lección con un grupo (`Tomar asistencia`), pase de lista con materia (`Abrir lista`, `Todos presentes`, `Presentes los que faltan`, `Guardar pase de lista`), filtros de Evaluaciones, formulario del Cuaderno calificador y edición de un rol.

## Hallazgo corregido

| Dónde | Qué pasaba | Corrección |
|---|---|---|
| C01, C04, C18 | Un Super Administrador sin institución elegida es devuelto al Panel de control con el aviso «Está viendo "Todas las instituciones". Para crear o importar datos, seleccione primero la institución en el Panel de Control.» al pulsar cualquier botón de crear o importar. Ningún capítulo lo explicaba. | Nota en C01, línea de errores y párrafo en C04 (Ver el sistema como una institución), y una pregunta en C18. |

## Lo confirmado en pantalla

- Los nombres de las pantallas, menús, filtros y botones de las listas coinciden con los capítulos.
- Con institución elegida, las pantallas de crear (Nueva materia, Nuevo Estudiante, Nueva rúbrica, Agregar horario, etc.) abren sin redirigir.
- El Cuaderno calificador pide Materia y Período Académico y muestra «No hay datos para mostrar» cuando no hay evaluaciones, como dice C13.
- En la edición de un rol, los botones por módulo son `Seleccionar Módulo` y `Deseleccionar Módulo`, además de `Seleccionar Todos` y `Deseleccionar Todos` en la cabecera. En la creación, los de cada módulo se llaman `Seleccionar Todos` y `Deseleccionar Todos`. C03 describe la creación y no promete otro nombre en la edición.

## Lo que no se pudo confirmar en pantalla

Estos nombres existen en el código (VERIFICACION_MN5_1.md) pero no aparecieron porque la pantalla solo los muestra en cierto estado o con datos que esta institución no tenía:

| Capítulo | Qué falta ver | Por qué no apareció |
|---|---|---|
| C03 | `Copiar enlace` (invitación), `Abrir todos`, `Cerrar todos`, `Marcar todo`, `Deshacer cambios`, `Guardar permisos` | Hace falta crear una invitación, y abrir la pantalla de permisos de un rol concreto. |
| C04 | `Rechazar`, `Copiar` (solicitudes), `Reactivar institución`, `Simular el borrado`, `Borrar los datos definitivamente`, `Salir y ver todas` | Solo salen con una solicitud pendiente o con una institución suspendida. `Salir y ver todas` está en la franja superior, que se vio pero no se pulsó. |
| C06, C11 | `Quitar guía`, `Otros períodos`, `Pasar lista` (Mis grupos); `Resumen de hoy`, `Ausencias del grupo`, `Ver horario del grupo` | La cuenta usada no está vinculada a un profesor, y la lista de asistencia diaria salió vacía para el período de trabajo. |
| C09 | `Abrir rematrícula`, `Cupo total`, `Por sección`, `Fecha de apertura`, `Guardar apertura`, `Marcar todas las pendientes`, `Conservar el número de sección`, `Confirmar marcadas` | Esta institución matricula por período; esas pantallas son de instituciones anuales. Falta probar con una institución anual. |
| C12 | `Asignar automáticamente`, `Configurar manualmente`, `Aplicar Valores Lineales`, `Copiar Fila Completa`, `Limpiar Todo`, `Limpiar fila` | Salen dentro de las pantallas de valores, que cargan con scripts. |
| C13, C14 | `Estado de evaluación`, `Ordenar por`, `Guardar componentes`, `Revisar componentes`; todas las pantallas de nota de conducta de un estudiante | No había datos en el cuaderno elegido, y ningún estudiante en riesgo o aplazado. |
| C05, C13, C15, C16 | `Quitar filtros`, `Quitar todos` | Solo aparecen con un filtro aplicado. |

## Lo que no cubre este recorrido

- **Vista de un profesor, un coordinador o un administrador de institución.** Solo se vio lo que ve un Super Administrador.
- **Resultado de las acciones.** Como no se guardó nada, no se comprobó qué mensaje aparece tras cada acción ni qué cambia después.
- **Capturas (MN8).** No se tomaron.
- **Impresión.** No se probó el botón Imprimir.

## Para completarlo

1. Una institución anual con matrículas, para C09 y C08.
2. Una cuenta de profesor, para C06, C11, C13 y C14.
3. Datos de conducta (boletas) y una solicitud de alta pendiente, para ver los estados que faltan.
4. Un recorrido que sí guarde, en una base de pruebas: es la única forma de confirmar los mensajes y efectos que describen los capítulos.

## Recorrido como profesor

Hecho el 2026-11-13 con la cuenta de un profesor en Universidad de Costa Rica, en solo lectura. 70 direcciones probadas.

### Lo que ve un profesor

- **Menú:** Inicio, Configuración, Evaluaciones, Conducta y Reportes. No ve Profesores ni Instituciones. Coincide con la tabla de C01.
- **Dentro de Configuración** ve: Períodos Académicos, Rúbricas (lista, ítems, niveles, valores), Estudiantes (lista, Empadronamiento, Empadronamiento Público, Grupos, Mis Grupos), Asistencia (Horarios, por lección, diaria, estadísticas, ausencias), Materias (lista, instrumentos), Cuadernos Calificadores y Cuaderno Automático PQ2025.
- **Pantallas que le niegan el acceso** («No tiene permiso para esta pantalla»): Tipos de Grupo, Facultades, Escuelas, Profesores Guía, Tipos de Formación Académica, importar estudiantes, Aprobar empadronamientos, Matrícula y su configuración, Carreras, Asignar Rúbricas a Instrumentos, Asignar Instrumentos a Materias, Reporte SEA y su configuración, Reporte de coordinación, Reportes de gestión, Auditoría, Administración, Usuarios, Invitaciones, Panel de la plataforma, Instituciones y Slider. Coincide con lo que dicen los capítulos sobre quién puede cada tarea.
- Abre sin problema `/Estudiantes/Create` y `/GruposEstudiantes/Create`: su rol tiene esos permisos.

### Confirmado

- **Mis grupos (C06):** muestra «Hoy», «Materias que imparto», «Otros períodos» y «Grupos donde soy guía», con los botones `Tomar asistencia`, `Pasar lista` y `Ausencias`, como dice el capítulo.
- **Asistencia (C11):** el profesor ve sus grupos en el selector y abre `Tomar asistencia` por lección. La lista de asistencia diaria sale vacía en el período actual: «No hay grupos con estudiantes en este período».
- **Pantallas solo con sesión (MN10.5):** una cuenta que no ve el menú Profesores abre `/Profesores`. Es la confirmación en pantalla de que el menú oculta pero no protege.

### Defecto encontrado

**Conducta falla con una cuenta de profesor** (MN10.41). Tres pantallas rompen por una consulta que no se puede traducir a SQL (`Controllers/NotaConductaController.cs`, línea 118):

| Pantalla | Qué ve el profesor |
|---|---|
| Conducta › Dashboard | «Error al cargar el dashboard» y «No hay estudiantes en este período» |
| Conducta › Registro de Boletas | El texto técnico de la excepción en lugar de la lista |
| Conducta › Historial por Estudiante y Reporte General | Lo devuelven al Dashboard con el mismo error |

Sí abren: Nueva Boleta (con la lista de estudiantes), Estudiantes en Riesgo, Estudiantes Aplazados y Programas de Acciones. Los capítulos C14 y C18 ya avisan de este defecto.

### Sigue sin verse

Matrícula anual (C09, C08), una solicitud de alta pendiente, una institución suspendida, y el resultado de las acciones al guardar.
