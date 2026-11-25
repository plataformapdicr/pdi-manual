# Glosario base del manual de PDI

Una sola forma aceptada por término. Las columnas "No use" son las variantes que el código o los documentos viejos mezclan; en el manual se usa la forma de la primera columna. Los textos de botones y campos se copian tal cual de la pantalla aunque difieran de esta lista (por ejemplo, el menú dice "Items de Evaluación" y "Ítems de evaluación" según la pantalla): en prosa se usa el término del glosario, y el nombre exacto solo dentro de `span.boton`, `span.campo` o `span.ruta`.

Este archivo es la base de MN2.2. La sesión principal lo amplía; los agentes de capítulo proponen términos en `PENDIENTE_CONFIRMAR.md`.

## Plataforma y personas

| Término | Qué significa | No use |
|---|---|---|
| PDI | Plataforma Docente Integral, el sistema que describe este manual | RubricasApp, la app, el sistema de rúbricas |
| institución | El centro educativo que usa el sistema. Cada institución ve solo sus propios datos | colegio, escuela, tenant (salvo cuando se habla de un tipo concreto) |
| institución activa | La institución con la que el usuario trabaja en este momento | institución seleccionada |
| usuario | Persona con cuenta para entrar a PDI | cuenta de usuario, login |
| rol | Conjunto de permisos: Super Administrador, Administrador, Coordinador, Profesor, Evaluador, Observador | perfil, nivel de acceso |
| permiso | Una acción concreta que el sistema permite o no (por ejemplo «Crear matrícula») | privilegio, derecho |
| Super Administrador | Rol de la plataforma, por encima de las instituciones | superadmin, root |
| profesor | Persona docente registrada en la institución. Es también el nombre del rol que usa el menú | docente (salvo que la pantalla lo diga), maestro |
| coordinador | Rol que gestiona una facultad o escuela | jefe de carrera, director |
| profesor guía | Profesor asignado a acompañar una sección | guía, tutor |
| formación académica | Estudios del profesor | títulos, estudios (cuando es la sección de la ficha) |
| tipo de formación académica | Categoría de un estudio, como Licenciatura | grado académico |
| capacitación | Actividad de actualización profesional del profesor | |
| experiencia laboral | Trabajos registrados del profesor | historial de trabajo |
| currículum | Documento que reúne la trayectoria del profesor | hoja de vida |
| vinculación | Asociación del registro de un profesor con un usuario | enlace de cuenta |
| encargado legal | Persona responsable de un estudiante menor de edad | tutor, padre o madre, responsable (cuando se habla de la persona) |
| estudiante | Persona que cursa en la institución | alumno, educando |

## Estructura académica

| Término | Qué significa | No use |
|---|---|---|
| curso lectivo | El año escolar de una institución que matricula una vez al año | año escolar, ciclo anual |
| período académico | Semestre, cuatrimestre, trimestre u otro tramo con fechas propias | período lectivo, ciclo, semestre (si es genérico) |
| período de trabajo | El período académico que el usuario eligió para ver y registrar datos | período activo, período seleccionado |
| régimen de matrícula | Si la institución matricula una vez al año o cada período | modalidad |
| nivel | Grado o bloque en el que está matriculado un estudiante: 7, 8, I, II | año (salvo que sea el nombre del nivel), curso |
| bloque | En una carrera, un tramo del plan de estudios con sus materias | cuatrimestre del plan, nivel (cuando es de universidad, la pantalla dice "Bloque") |
| sección | Grupo de estudiantes de un nivel que comparten aula y horario: 7-1, 7-2 | grupo (cuando se refiere a 7-1), salón, aula |
| grupo de estudiantes | Registro del sistema que representa una sección o un grupo de una materia. En la pantalla se llama "Grupos de Estudiantes" | clase |
| tipo de grupo | Categoría de un grupo de estudiantes (sección, taller, etc.) | clasificación de grupo |
| materia | Asignatura que se imparte | asignatura, curso (cuando es una materia) |
| plan de estudios | Lista de materias por bloque de una carrera, con créditos | malla, pénsum, currículo |
| carrera | Programa de estudios de una universidad o instituto | programa |
| facultad | Unidad mayor que agrupa escuelas | |
| escuela o departamento | Unidad dentro de una facultad. El menú dice "Escuelas / Departamentos" | |
| crédito | Valor de una materia en un plan de estudios | unidad valorativa |
| cupo | Cantidad máxima de estudiantes que admite un nivel, una sección o una materia | capacidad, aforo (salvo el campo de pantalla) |
| lista de espera | Estudiantes con la matrícula solicitada que no caben todavía porque el cupo del nivel está lleno. El estado se llama "En espera" | cola, pendientes de cupo |

## Ingreso y matrícula

| Término | Qué significa | No use |
|---|---|---|
| empadronamiento | Registro completo de los datos del estudiante: personales, responsables, salud, documentos. Se hace una vez y se actualiza | registro, inscripción, pre-matrícula, matrícula (nunca) |
| empadronamiento público | Formulario sin sesión donde la familia llena el empadronamiento | auto-empadronamiento, pre-registro público |
| aprobación del empadronamiento | Revisión que deja el empadronamiento en estado Aprobado y permite matricular | validación |
| matrícula | Inscripción de un estudiante en un curso lectivo o período: nivel, sección o materias | inscripción (salvo inscribir materias), empadronamiento |
| matricular | Crear y formalizar una matrícula | inscribir (a un estudiante en la institución) |
| formalizar | Dejar la matrícula confirmada y asignar la sección | confirmar (se reserva para "Confirmar matrícula" de la pantalla de materias) |
| matrícula extraordinaria | Matrícula fuera de las fechas ordinarias, solo con permiso | matrícula tardía |
| rematrícula | Proceso anual en el que se propone a todo estudiante en el nivel siguiente para que la secretaría lo revise | renovación, matrícula masiva |
| repitente | Condición de quien repite el nivel | reprobado |
| condición de matrícula | Nuevo ingreso, Regular, Repitente, Traslado entrante o Reingreso | tipo de matrícula |
| comprobante | Documento PDF de una matrícula | boleta de matrícula, constancia |
| cierre de matrícula | Retiro, traslado o anulación de una matrícula | baja |
| inscribir materias | Elegir las materias de la oferta del período (institución por período) | matricular materias |

## Evaluación

| Término | Qué significa | No use |
|---|---|---|
| rúbrica | Tabla de criterios y niveles con que se califica un trabajo | matriz de evaluación |
| ítem de evaluación | Cada criterio de una rúbrica | criterio (salvo que la pantalla lo diga), indicador |
| nivel de calificación | Un grado de logro dentro de una rúbrica, con su puntaje | escala, descriptor |
| grupo de calificación | Conjunto de niveles de calificación que se elige al preparar una rúbrica. No es un grupo de estudiantes | escala |
| valor de rúbrica | Puntos de una combinación de rúbrica, ítem y nivel de calificación | puntaje de celda |
| ponderación | Porcentaje de la nota final de la materia que aporta una rúbrica o un instrumento | peso (salvo el campo de pantalla) |
| instrumento de evaluación | Prueba, trabajo, tarea u otra actividad que se califica con una o varias rúbricas | actividad, examen (salvo cuando lo sea) |
| evaluación | Aplicación de un instrumento a un estudiante, con su nota | calificación (el resultado), prueba |
| cuaderno calificador | Tabla de notas por estudiante e instrumento, que suma el período | libro de notas, cuaderno de notas |
| SEA | Sistema de Evaluación del MEP; el reporte SEA lleva las notas en su formato | |
| boleta de conducta | Registro de una falta de conducta | reporte de conducta, falta |
| nota de conducta | Calificación de conducta que el sistema calcula con las boletas | |
| programa de acciones | Plan de seguimiento para un estudiante con conducta en riesgo | plan de mejora |
| asistencia por lección | Registro de asistencia en cada lección del horario del grupo | asistencia por hora |
| pase de lista diario | Registro de asistencia por materia y fecha, sin depender del horario. El menú lo llama "Asistencia Diaria" | pase de lista por hora |
| lección | Franja del horario de un grupo para una materia, con día y horas | clase, bloque (el "Número de bloque" es su posición en el día) |
| conflicto de horario | Coincidencia de horas entre dos lecciones el mismo día | choque (salvo la marca «Choque de horario» de la pantalla) |
| horario | Franjas semanales de lecciones de una sección | calendario de clases |

## Uso de la pantalla

| Término | Qué significa | No use |
|---|---|---|
| Panel de control | La pantalla de inicio con sesión iniciada | dashboard, inicio (salvo el botón de menú «Inicio») |
| módulo | Cada parte grande del sistema (Matrícula, Rúbricas, Reportes). Es el nombre que usan las pantallas de permisos | área, sección del sistema |
| menú | La barra superior con Configuración, Profesores, Instituciones, Evaluaciones, Conducta y Reportes | barra de navegación, navbar |
| pulsar | Hacer clic o tocar un botón o enlace | clic, presionar, dar click |
| elegir | Escoger una opción de una lista | seleccionar |
| escribir | Teclear en un campo | digitar, ingresar (un dato) |
| iniciar sesión | Entrar a PDI con usuario y contraseña | loguearse, entrar al sistema |
| estado | Situación de un registro: Formalizada, En espera, Anulada | status |
| captura | Imagen de la pantalla. En el manual, un recuadro que la describe hasta MN8 | pantallazo, screenshot |

## Cómo se añade un término

1. Búsquelo aquí. Si está, use la forma de la primera columna.
2. Si no está, escríbalo como usted lo usaría y agregue una línea a `PENDIENTE_CONFIRMAR.md`: "Glosario: propongo «X» = definición; no use «Y». Capítulo: CNN".
3. La sesión principal lo acepta, lo corrige o lo rechaza al integrar (MN5.4 y MN7.2).
