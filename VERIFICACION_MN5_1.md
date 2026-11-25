# Verificación cruzada MN5.1

Capítulos escritos por Codex, revisados por Claude el 2026-11-13 sobre el commit `0ea24f6a3f`: C05, C06, C07, C10, C12, C13 y C15. C17, C18 y C19 no citan pantallas (salen de los demás capítulos) y solo se comprobó que sus enlaces existen.

## Qué se comprobó y cómo

Dos comprobaciones automáticas contra el código, más la revisión a mano de cada diferencia.

1. **Nombres y mensajes.** Cada texto marcado como botón, campo, ruta o valor, y cada mensaje entre comillas «», se buscó en las vistas, los controladores, los servicios y los scripts de la aplicación (sin tildes ni mayúsculas, y sin el marcado HTML).
2. **Permisos.** Los permisos que nombra cada capítulo se compararon con los que exigen los controladores de su sección del inventario, sus vistas y el menú.

## Resultado

| Capítulo | Citas comprobadas | No encontradas | Permisos nombrados | Permisos sin respaldo en el código |
|---|---|---|---|---|
| C05 Estructura académica | 355 | 4 | 23 | 0 |
| C06 Profesores | 320 | 0 | 6 | 0 |
| C07 Estudiantes y grupos | 273 | 0 | 16 | 0 |
| C10 Horarios | 124 | 0 | 2 | 0 |
| C12 Rúbricas e instrumentos | 234 | 0 | 23 | 0 |
| C13 Evaluaciones y cuaderno calificador | 225 | 1 | 10 | 0 |
| C15 Reportes y exportaciones | 250 | 6 | 3 | 0 |
| **Total** | **1781** | **11** | | **0** |

Ninguna de las 11 citas no encontradas es un error:

| Capítulo | Cita | Explicación |
|---|---|---|
| C05 | «Facultad de Ejemplo», «Escuela de Ejemplo», «Materia de Ejemplo», «EJ101» | Datos de ejemplo del manual, permitidos por la guía (regla 7). |
| C13 | «2 decimales» | La vista arma el texto: número más « decimales» (`Views/SEA/Index.cshtml`, línea 47). |
| C15 | «Exportar a Moodle», «Exportar a CSV genérico», «Exportar a Excel genérico» | La vista arma «Exportar a» más el nombre del formato (`Views/Exportaciones/Index.cshtml`, línea 48; nombres en `Services/Exportaciones/FormatosExportacion.cs`). |
| C15 | «Descargar archivo», «Descargar CSV para Moodle», «Descargar ZIP para Moodle» | La vista arma «Descargar» más la etiqueta (`Views/Exportaciones/Asistente.cshtml`, líneas 10 y 273). |

Permisos que el código exige y el capítulo no nombra, todos justificados:

| Capítulo | Permiso | Explicación |
|---|---|---|
| C05 | `periodos.activar`, `periodos.cerrar`, `periodos.gestionar_calendario` | Acciones sin botón o sin pantalla (MN10.16 y MN10.18). |
| C10 | `estudiantes.*`, `matricula.ver` | Son del controlador de Estudiantes, que C10 solo cita por la ficha; se documentan en C07 y C09. |
| C13 | `sea.exportar_pdf` | Exportación no implementada (MN10.10). |

`evaluaciones.ver_todas`, que C13 nombra, no está en un controlador sino en `Services/Evaluaciones/AlcanceEvaluacionService.cs`: es correcto.

## Lo que esta verificación no cubre

- **Orden de los pasos y efectos descritos.** La comprobación confirma que cada nombre existe en la aplicación, no que esté en la pantalla que dice el capítulo ni que los pasos sigan el orden real. Eso solo se confirma recorriendo la aplicación (MN7.3) o leyendo cada vista contra su tarea.
- **C07, C10 y C12** se escribieron mientras otra sesión editaba esas vistas. Los nombres coinciden con el código de esta rama; al fusionar los cambios de la otra sesión, `armar.cjs` avisará de las vistas con commits posteriores al capítulo (MN9.2) y habrá que repetir esta comprobación.

## Cómo repetirla

Los dos scripts se usaron una sola vez y no quedaron en el repositorio. La forma más simple de repetir la parte de nombres es pedirla de nuevo a un agente con este archivo como guía.
