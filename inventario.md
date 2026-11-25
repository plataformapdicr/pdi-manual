# Inventario para el manual de usuario de PDI

Commit de partida: `99560da0a3` (origin/master, "Merge pull request #7 from heinergc/feature-matricula"). Fecha del inventario: 2026-11-12.

Este documento es el mapa menú, pantallas, permisos y capítulo (bloque MN1 de `DOCS/ROADMAP_MANUAL.md`). Lo usa cada agente de capítulo para saber qué archivos leer sin recorrer todo el código. Si una vista cambió después del commit de partida, vale la vista actual.

## Cómo leer las tablas

- **Ruta:** `Controlador/Acción`. La dirección en el navegador es `/Controlador/Acción`. Las del área de administración llevan `Admin/` delante (`/Admin/Users`).
- **Archivos fuente:** el controlador está en `Controllers/<Controlador>Controller.cs` (los de administración, en `Areas/Admin/Controllers/`). Las vistas están en `Views/<Controlador>/` (o `Areas/Admin/Views/<Controlador>/`); la tabla nombra solo los archivos `.cshtml`, sin extensión.
- **Permiso:** el valor que exige el atributo `[RequirePermission]`. "Solo sesión" significa que la pantalla solo pide haber iniciado sesión y no revisa ningún permiso. "Rol:" significa que se exige un rol y no un permiso.
- **Apoyo:** documento de `DOCS/` que puede servir de base. No se verificó que esos documentos estén al día: el código manda.

## Hallazgos generales (afectan a todos los capítulos)

1. **Roles.** Hay seis roles definidos en `Models/Permissions/ApplicationRoles.cs`. El nombre interno no siempre coincide con el que se muestra:

   | Rol (nombre interno) | Cómo lo muestra el menú de usuario |
   |---|---|
   | `SuperAdmin` | Super Administrador |
   | `Admin` | Administrador |
   | `Coordinador` | Coordinador |
   | `Profesor` (constante `Docente`) | Profesor |
   | `Evaluador` | Evaluador |
   | `Observador` | Observador |

   El arranque (`PermissionService.InitializeDefaultRolesAndPermissionsAsync`) crea cinco roles; `Observador` no se crea ahí.

2. **Permisos por defecto.** El código solo asigna permisos al rol `SuperAdmin`, que recibe todos (`AssignAllPermissionsToSuperAdminAsync`). Los demás roles no reciben nada desde el código: sus permisos están en la base de datos y se asignan en Administración, Permisos, o por scripts SQL. Los scripts del repositorio dan:

   | Permisos | Roles | Script |
   |---|---|---|
   | `matricula.*` (seis) y `empadronamiento.aprobar` | SuperAdmin, Admin | `Scripts/AgregarMatriculas.sql` |
   | `empadronamiento.aprobar` | Coordinador | `Scripts/AgregarMatriculas.sql` |
   | `coordinacion.asignar` | SuperAdmin, Admin | `Scripts/AgregarCoordinacionEscuelas.sql` |
   | `exportaciones.ver`, `exportaciones.crear` | Admin, Coordinador, Profesor | `Scripts/CrearPlantillasExportacion.sql` |

   La lista `GetRolePermissions` de `ApplicationRoles.cs` usa nombres viejos (`users.manage`, `rubricas.manage`) que no existen en `ApplicationPermissions.cs`; no se usa para sembrar. Qué permisos tiene hoy cada rol en la base real queda en `PENDIENTE_CONFIRMAR.md` (punto 1).

3. **Pantallas que solo piden sesión.** Varios módulos no revisan permisos en el controlador; el menú decide quién ve la entrada, pero quien conozca la dirección entra: Profesores, Rúbricas (salvo Compartir), Evaluaciones, Horarios, AsistenciaLeccion, BoletasConducta, NotaConducta, ProgramaAcciones, Reportes, MisGrupos, CalificadorPQ2025, ImportarRubrica, PeriodoAcademico e InstrumentoRubrica (salvo el listado). En el manual, "quién puede hacerla" para esas pantallas se describe por lo que muestra el menú.

4. **Área de administración.** Todos los controladores de `Areas/Admin` exigen el rol `SuperAdmin`, además del permiso de cada acción. El menú principal muestra "Panel de Administración" también al rol `Admin`, que al entrar recibirá "acceso denegado" (ver `PENDIENTE_CONFIRMAR.md`, punto 2).

5. **Institución activa.** Un filtro global (`Filters/RequiereInstitucionActivaFilter`) exige tener una institución activa. Quedan exentos los controladores marcados `PermitirSinInstitucion`: Instituciones, Invitaciones, Plataforma, Slider y TiposFormacionAcademica.

## Menú completo (MN1.1)

### Menú principal: `Views/Shared/_Layout.cshtml`

| Menú | Submenú | Texto visible | Ruta | Se muestra si |
|---|---|---|---|---|
| (barra) | | PDI / Plataforma Docente Integral (logo) | Home/Index | Siempre |
| (barra) | | Inicio | Home/Index | Siempre |
| Configuración | | Períodos Académicos | PeriodosAcademicos/Index | `periodos.ver` |
| Configuración | | Configuración de matrícula | Matricula/Configuracion | `matricula.configurar` |
| Configuración | | Carreras | Carreras/Index | `matricula.configurar` |
| Configuración | Rúbricas | Lista de Rúbricas | Rubricas/Index | `rubricas.ver` o `rubricas.ver_todas` |
| Configuración | Rúbricas | Items de Evaluación | ItemsEvaluacion/Index | `items_evaluacion.ver` |
| Configuración | Rúbricas | Niveles de Calificación | NivelesCalificacion/Index | `niveles.ver` |
| Configuración | Rúbricas | Valores de Rúbricas | ValorRubrica/Index | `niveles.ver` |
| Configuración | Rúbricas | Asignar Rúbricas a Instrumentos | InstrumentoRubrica/Index | `instrumento_rubrica.ver` |
| Configuración | Estudiantes | Lista de Estudiantes | Estudiantes/Index | `estudiantes.ver` |
| Configuración | Estudiantes | Empadronamiento | Empadronamiento/Index | Submenú visible (sin condición propia) |
| Configuración | Estudiantes | Matrícula | Matricula/Index | `matricula.ver` |
| Configuración | Estudiantes | Aprobar empadronamientos | Aprobaciones/Index | `empadronamiento.aprobar` |
| Configuración | Estudiantes | Empadronamiento Público | EmpadronamientoPublico/Index | Submenú visible (sin condición propia) |
| Configuración | Estudiantes | Grupos de Estudiantes | GruposEstudiantes/Index | `grupos_estudiantes.ver` |
| Configuración | Estudiantes | Mis Grupos | MisGrupos/Index | Rol Profesor o Coordinador |
| Configuración | Estudiantes | Tipos de Grupo | TiposGrupo/Index | `tipos_grupo.ver` |
| Configuración | Estudiantes, Asistencia | Horarios de Clases | Horarios/Index | `asistencia.ver` |
| Configuración | Estudiantes, Asistencia | Tomar Asistencia por Lección | AsistenciaLeccion/Index | `asistencia.ver` |
| Configuración | Estudiantes, Asistencia | Asistencia Diaria | Asistencia/Index | `asistencia.ver` |
| Configuración | Estudiantes, Asistencia | Estadísticas de Asistencia | AsistenciaLeccion/Estadisticas | `asistencia.ver` |
| Configuración | Estudiantes, Asistencia | Reporte de Ausencias | AsistenciaLeccion/Ausencias | `asistencia.ver` |
| Configuración | Materias | Lista de Materias | Materias/Index | `materias.ver` |
| Configuración | Materias | Instrumentos de Evaluación | InstrumentosEvaluacion/Index | `instrumentos_evaluacion.ver` |
| Configuración | Materias | Asignar Instrumentos a Materias | InstrumentoMaterias/Index | `instrumento_materias.ver` |
| Configuración | | Cuadernos Calificadores | CuadernoCalificador/Index | `cuaderno_calificador.ver` |
| Configuración | | Cuaderno Automático PQ2025 | CalificadorPQ2025/Index | `cuaderno_calificador.ver` |
| Configuración | | Historial de Auditoría | Auditoria/Index | `auditoria.ver` |
| Configuración | Administración | Panel de Administración | Admin/Index (área Admin) | Rol SuperAdmin o Admin, o `admin.ver_dashboard` |
| Configuración | Administración | Usuarios | Account/ManageUsers | Rol SuperAdmin o Admin |
| Configuración | Administración | Gestión de Slider | Slider/Index | Rol SuperAdmin |
| Profesores | | Lista de Profesores | Profesores/Index | `profesores.ver` |
| Profesores | | Nuevo Profesor | Profesores/Create | `profesores.crear` |
| Profesores | | Profesores Guía | ProfesorGuia/Index | Rol SuperAdmin, Admin o Coordinador |
| Profesores | | Tipos de Formación Académica | TiposFormacionAcademica/Index | `tipos_formacion_academica.ver` |
| Instituciones | | Lista de Instituciones | Instituciones/Index | `instituciones.ver` |
| Instituciones | | Nueva Institución | Instituciones/Create | `instituciones.crear` |
| Instituciones | | Invitaciones de Usuarios | Invitaciones/Index | `invitaciones.ver` |
| Instituciones | | Panel de la plataforma | Plataforma/Index | Rol SuperAdmin |
| Instituciones | | Solicitudes de Alta | Instituciones/Solicitudes | Rol SuperAdmin |
| Instituciones | | Facultades | Facultades/Index | `instituciones.ver` |
| Instituciones | | Escuelas / Departamentos | Escuelas/Index | `instituciones.ver` |
| Evaluaciones | | Lista de Evaluaciones | Evaluaciones/Index | `evaluaciones.ver` |
| Evaluaciones | | Crear Nueva Evaluación | Evaluaciones/Create | `evaluaciones.crear` |
| Evaluaciones | | Exportar calificaciones | Exportaciones/Index | `exportaciones.ver` |
| Conducta | | Dashboard | NotaConducta/Dashboard | Rol SuperAdmin, Admin, Coordinador o Profesor |
| Conducta | | Registro de Boletas | BoletasConducta/Index | Igual |
| Conducta | | Nueva Boleta | BoletasConducta/Create | Igual |
| Conducta | | Estudiantes en Riesgo | NotaConducta/EstudiantesRiesgo | Igual |
| Conducta | | Estudiantes Aplazados | NotaConducta/EstudiantesAplazados | Igual |
| Conducta | | Programas de Acciones | ProgramaAcciones/Index | Igual |
| Conducta | | Historial por Estudiante | Reportes/SeleccionarEstudiante | Igual |
| Conducta | | Reporte General | Reportes/ReporteGeneralConducta | Igual |
| Reportes | | Centro de Reportes | Reportes/Index | Rol SuperAdmin, Admin o Coordinador, o `reportes.ver_basicos` |
| Reportes | | Reporte de coordinación | ReporteCoordinacion/Index | Rol SuperAdmin, Admin o Coordinador |
| Reportes | | Avance de evaluación | ReportesGestion/Avance | Rol SuperAdmin, Admin o Coordinador |
| Reportes | | Carga docente | ReportesGestion/CargaDocente | Rol SuperAdmin, Admin o Coordinador |
| Reportes | | Estudiantes en alerta | ReportesGestion/Alertas | Rol SuperAdmin, Admin o Coordinador |
| Reportes | | Comparativo entre períodos | ReportesGestion/Comparativo | Rol SuperAdmin, Admin o Coordinador |
| Reportes | | Calidad de los datos | ReportesGestion/CalidadDatos | Rol SuperAdmin o Admin |
| Reportes | | Reporte en Árbol | Reportes/ArbolEvaluaciones | Menú Reportes visible |
| Reportes | | Dashboard General | Reportes/Dashboard | Menú Reportes visible |
| Reportes | | Reportes de Evaluaciones | Evaluaciones/Reportes | Menú Reportes visible |
| Reportes | | Cuaderno Calificador | CuadernoCalificador/Index | Menú Reportes visible |
| Reportes | | Reporte SEA (MEP) | SEA/Index | Menú Reportes visible |
| (usuario) | | Cambiar institución (un botón por institución) | Account/CambiarInstitucion | Usuario con más de una institución |
| (usuario) | | Mi Perfil | Account/Profile | Con sesión |
| (usuario) | | Cambiar Contraseña | Account/ChangePassword | Con sesión |
| (usuario) | | Cerrar Sesión | Account/Logout | Con sesión |
| (barra) | | Registrarse | Account/Register | Sin sesión |
| (barra) | | Iniciar Sesión | Account/Login | Sin sesión |

El menú "Configuración" completo se muestra a los roles SuperAdmin, Admin, Coordinador y Profesor, o a quien tenga `configuracion.ver`. El menú "Evaluaciones" se muestra además al rol Evaluador.

### Menú del área de administración: `Areas/Admin/Views/Shared/_Layout.cshtml`

Toda el área exige el rol SuperAdmin.

| Texto visible | Ruta | Permiso |
|---|---|---|
| PDI Administración (logo) | Admin/Index | `admin.ver_dashboard` |
| Ir a la aplicación | Home/Index | |
| Mi perfil | Account/Profile | Con sesión |
| Revisar roles (desarrollo) | Home/DebugRoles | Solo en entorno de desarrollo |
| Cerrar sesión | Account/Logout | |
| Inicio | Admin/Index | `admin.ver_dashboard` |
| Usuarios | Users/Index | `usuarios.ver` |
| Roles | Roles/Index | Solo rol |
| Permisos | Permissions/Index | `configuracion.gestionar_permisos` |
| Configuración | Configuracion/Index | `configuracion.ver` |
| Auditoría | Audit/Index | `auditoria.ver` |
| Estado del sistema (abre otra pestaña) | Admin/Health | `configuracion.verificar_estado` |

### Panel de control: `Views/Home/Index.cshtml`

No es menú, pero es la entrada habitual. Con sesión muestra: selector "Ver sistema como" (institución, solo SuperAdmin; `Instituciones/SeleccionarInstitucion` y `LimpiarSeleccionInstitucion`), selector de período (componente `PeriodoAcademicoSelector`, controlador `PeriodoAcademico`), y los bloques "Para continuar", "Módulos", "Gestión académica", "Herramientas", "Resumen", "Actividad reciente" y "Su cuenta". Sin sesión muestra la portada pública con "Entrar a la plataforma", el aviso "Empadronamiento de estudiantes abierto" (`EmpadronamientoPublicoInicio/Index`) y la presentación del sistema.

## Tablas por capítulo (MN1.4)

### C01 Visión general y mapa del sistema (Claude)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Portada pública | Home/Index (sin sesión) | `Views/Home/Index`, componente `Slider` | Pública | `SPEC_PORTADA_PUBLICA.md` |
| Panel de control | Home/Index (con sesión) | `Views/Home/Index`, `HomeController` | Con sesión; cada bloque según permisos | `COMERCIAL/FICHA_TECNICA.md`, `COMERCIAL/GUIA_DEMO.md` |
| Menú principal | (todas) | `Views/Shared/_Layout` | Ver "Menú completo" | |
| Privacidad | Home/Privacy | `Views/Home/Privacy` | Pública | |
| Presentación del portal del estudiante | (otro repositorio) | `DOCS/PortalEstudiante/` | | `PortalEstudiante/INDICE_DOCUMENTACION_WEB_MOVIL.md` |

### C02 Primeros pasos (Claude-S)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Iniciar sesión | Account/Login | `Views/Account/Login` | Pública | `IMPLEMENTACION_GOOGLE_OAUTH.md` (si el botón de Google está activo) |
| Registrarse | Account/Register | `Register`, `RegistroCerrado` | Pública; depende del modo de registro | |
| Olvidé mi contraseña | Account/ForgotPassword, Account/ResetPassword | `ForgotPassword`, `ForgotPasswordConfirmation`, `ResetPassword`, `ResetPasswordConfirmation` | Pública | |
| Aceptar una invitación | Account/AceptarInvitacion, Invitacion/Acceso | `AceptarInvitacion`, `AceptarInvitacionExistente`, `InvitacionInvalida` | Pública (con enlace) | |
| Solicitar el alta de una institución | Account/SolicitarInstitucion | `SolicitarInstitucion`, `SolicitudEnviada` | Pública | |
| Mi perfil | Account/Profile | `Profile` | Con sesión | |
| Cambiar contraseña | Account/ChangePassword | `ChangePassword` | Con sesión | |
| Cambiar de institución | Account/CambiarInstitucion | menú de usuario en `_Layout` | Con sesión y más de una institución | |
| Elegir el período de trabajo | PeriodoAcademico/Seleccionar, Establecer, CambiarPeriodo, Limpiar | `Views/PeriodoAcademico/Seleccionar`, componente `PeriodoAcademicoSelector` | Solo sesión | |
| Acceso denegado | Account/AccessDenied | `AccessDenied` | Pública | |
| Menú de accesibilidad | (todas las páginas) | `Views/Shared/_AccessibilityMenu`, `wwwroot/css/accessibility-menu.css` | | |
| Instalar en el celular | (todas las páginas) | `Views/Shared/_Pwa` | | `PortalEstudiante/RESUMEN_PWA_ANDROID_IPHONE.md` |
| Cerrar sesión | Account/Logout | menú de usuario | | |

### C03 Roles, permisos y usuarios (Claude)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Panel de administración | Admin/Index, Admin/Stats | `Areas/Admin/Views/Admin/Index` | Rol SuperAdmin y `admin.ver_dashboard` | `INSTRUCCIONES_ADMIN_SEEDING.md` |
| Inicializar y sincronizar permisos | Admin/Initialize, Admin/SyncPermissions | (botones del panel) | `configuracion.gestionar` | |
| Usuarios (administración) | Admin/Users: Index, Details, Create, Edit, Delete, ResetPassword, AgregarMembresia, DesactivarMembresia | `Areas/Admin/Views/Users/` | `usuarios.ver`, `.crear`, `.editar`, `.eliminar` | `Guia-Prueba-Admin-Users.md` |
| Roles | Admin/Roles: Index, Create, Edit, Delete, GetRoleUsers, SyncPermissions | `Areas/Admin/Views/Roles/` | `configuracion.gestionar_roles`; Index solo rol | |
| Permisos y matriz | Admin/Permissions: Index, Details, SelectRoleForAssignment, AssignToRolePage, AssignToRole, RemoveFromRole, SyncPage, Sync, ExportMatrix, ExportToExcel, ExportToCsv, PrintMatrix | `Areas/Admin/Views/Permissions/` | `configuracion.gestionar_permisos` | `architecture/sesion-2026-08-10-multitenancy-permisos.md` |
| Usuarios (menú principal) | Account/ManageUsers, CreateUser, EditUser, LockUser, UnlockUser, DeleteUser, GetUserDetails | `Views/Account/ManageUsers` | Rol SuperAdmin o Admin | |
| Invitaciones de usuarios | Invitaciones/Index, Create, Revocar | `Views/Invitaciones/` | `invitaciones.ver`, `.crear`, `.revocar` | |

### C04 Plataforma e instituciones (Claude-S)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Panel de la plataforma | Plataforma/Index | `Views/Plataforma/Index` | Rol SuperAdmin | |
| Instituciones | Instituciones/Index, Details, Create, Edit, Delete | `Views/Instituciones/` | `instituciones.ver`, `.ver_detalles`, `.crear`, `.editar`, `.eliminar` | `PERSONALIZACION_POR_INSTITUCION.md` |
| Acciones de plataforma sobre una institución | Instituciones/ConfigurarEmpadronamiento, Suspender, Reactivar, ExportarDatos, SimularBorrado, BorrarDefinitivo, DarDeBaja, InicializarDatosBase | `Details`, `SimulacionBorrado` | Rol SuperAdmin | |
| Solicitudes de alta | Instituciones/Solicitudes, AprobarSolicitud, RechazarSolicitud | `Solicitudes` | Rol SuperAdmin | |
| Ver el sistema como una institución | Instituciones/SeleccionarInstitucion, LimpiarSeleccionInstitucion | `Views/Home/Index`, `Views/Shared/_FranjaVerComo` | Rol SuperAdmin | |
| Gestión de slider | Slider/Index, Create, Edit, Delete, ToggleActive | `Views/Slider/` | Rol SuperAdmin | `MODULO_SLIDER_DINAMICO.md`, `prompt-imagenes-carrusel.md` |
| Configuración del sistema | Admin/Configuracion: Index, General, Seguridad, Email, EnviarCorreoPrueba, Logs, HealthCheck, ActualizarModoRegistro, ActualizarEmpadronamientoPublico, MantenimientoMode | `Areas/Admin/Views/Configuracion/` | `configuracion.ver`, `.editar_sistema`, `.editar_seguridad`, `.configurar_email`, `.ver_logs`, `.modo_mantenimiento`, `.verificar_estado` | `ENVIRONMENT_CONFIG.md` |
| Estado del sistema | Admin/Health | (respuesta directa) | `configuracion.verificar_estado` | `MONITOREO_Y_RESPALDO.md` |

### C05 Estructura académica (Codex)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Períodos académicos | PeriodosAcademicos/Index, Details, Create, Edit, Delete, Activar, Cerrar, GestionarCalendario | `Views/PeriodosAcademicos/` | `periodos.ver`, `.crear`, `.editar`, `.eliminar`, `.activar`, `.cerrar`, `.gestionar_calendario` | |
| Materias | Materias/Index, Details, Create, Edit, Delete, AgregarRequisito, QuitarRequisito | `Views/Materias/` | `materias.ver`, `.ver_detalles`, `.crear`, `.editar`, `.eliminar` | |
| Instrumentos de una materia | Materias/Instrumentos, AsignarInstrumentos, AsignarInstrumento, QuitarInstrumento | `Instrumentos`, `AsignarInstrumentos` | `materias.ver_instrumentos`, `.asignar_instrumentos`, `.quitar_instrumentos` | |
| Tipos de grupo | TiposGrupo/Index, Details, Create, Edit, Delete, ToggleEstado | `Views/TiposGrupo/` | `tipos_grupo.ver`, `.ver_detalles`, `.crear`, `.editar`, `.eliminar`, `.cambiar_estado` | |
| Facultades | Facultades/Index, Details, Create, Edit, Delete, CambiarEstado | `Views/Facultades/` | `instituciones.ver`, `.crear`, `.editar`, `.eliminar` | |
| Escuelas o departamentos | Escuelas/Index, Details, Create, Edit, Delete, CambiarEstado, Reporte | `Views/Escuelas/` | `instituciones.ver`, `.crear`, `.editar`, `.eliminar` | |
| Coordinadores y profesores a cargo | Facultades/AsignarCoordinador, QuitarCoordinador; Escuelas/AsignarCoordinador, QuitarCoordinador, AgregarProfesor, ActualizarProfesor, QuitarProfesor | `Views/Facultades/Details`, `Views/Escuelas/Details` | `coordinacion.asignar` | `ANALISIS_COORDINADOR_PROFESORES_A_CARGO.md` |

### C06 Profesores (Codex)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Lista y detalle de profesores | Profesores/Index, Details | `Views/Profesores/Index`, `Details`, `_DetailsTrayectoria` | Solo sesión (menú: `profesores.ver`) | |
| Nuevo profesor (seis pasos) | Profesores/Create, CreateStep1 a CreateStep6, ConsultarCedula | `CreateStep1` a `CreateStep6` | Solo sesión (menú: `profesores.crear`) | |
| Editar, activar y eliminar | Profesores/Edit, UpdatePersonal, UpdateContacto, UpdateDireccion, UpdateAdicional, ToggleStatus, Delete | `Edit`, `Delete` | Solo sesión | `DELETE_PROFESOR_CASCADE.md`, `FAQ_DELETE_PROFESOR.md`, `FLUJO_DELETE_CASCADE.md` |
| Currículum en PDF | Profesores/GenerarCurriculumPdf, GenerarCurriculumsMasivoPdf | `Views/Shared/_CurriculumTemplate`, `_CurriculumMasivoTemplate` | Solo sesión | |
| Vincular con un usuario | Profesores/VincularUsuario, DesvincularUsuario | `VincularUsuario` | Solo sesión | |
| Profesores guía | ProfesorGuia/Index, Create, Edit, Delete, PorGrupo | `Views/ProfesorGuia/` | Rol SuperAdmin, Admin o Coordinador | |
| Mis grupos | MisGrupos/Index | `Views/MisGrupos/Index`, `_TablaMaterias` | Solo sesión (menú: rol Profesor o Coordinador) | `architecture/matriz-datascope.md` |
| Tipos de formación académica | TiposFormacionAcademica/Index, Details, Create, Edit, Delete, CambiarEstado | `Views/TiposFormacionAcademica/` | `tipos_formacion_academica.ver`; crear, editar y eliminar exigen además rol SuperAdmin | |

### C07 Estudiantes y grupos (Codex)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Lista y ficha de estudiantes | Estudiantes/Index, Details, Search, BuscarPorCedula | `Views/Estudiantes/Index`, `Details`, `_AsistenciaEstudiante`, `_HorarioEstudiante`, `_MatriculasEstudiante` | `estudiantes.ver` | `ANALISIS_PERFIL_ESTUDIANTE.md` |
| Crear, editar y eliminar | Estudiantes/Create, Edit, Delete | `Create`, `Edit`, `Delete` | `estudiantes.crear`, `.editar`, `.eliminar` | |
| Importar desde Excel | Estudiantes/ImportarExcel, DescargarPlantilla | `ImportarExcel` | `estudiantes.importar`, `.exportar` | |
| Acciones en lote | Estudiantes/EliminarPorFiltro, EliminarSeleccionados, CambiarEstadoSeleccionados | `Index` | `estudiantes.eliminar`, `.editar` | |
| Grupos de estudiantes | GruposEstudiantes/Index, Details, Create, Edit, Delete | `Views/GruposEstudiantes/` (sin los archivos `-bk`) | `grupos_estudiantes.ver`, `.ver_detalles`, `.crear`, `.editar`, `.eliminar` | |
| Asignar y quitar estudiantes | GruposEstudiantes/AsignarEstudiantes, DesasignarEstudiante y variantes | `AsignarEstudiantes` | `grupos_estudiantes.asignar_estudiantes`, `.desasignar_estudiantes` | |
| Materias del grupo | GruposEstudiantes/ObtenerMateriasDisponibles, AsignarMaterias, DesasignarMateria | `Details` | Solo sesión | |
| Estadísticas y exportación | GruposEstudiantes/Estadisticas, ExportarExcel, ExportarEstudiantesExcel | `Estadisticas` | `grupos_estudiantes.ver_estadisticas`, `.exportar` | |

### C08 Empadronamiento (Claude-S)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Empadronamiento (interno) | Empadronamiento/Index, Details, Create, Edit, CambiarEtapa | `Views/Empadronamiento/` con `_Academico`, `_AlertasSalud`, `_ContactoResidencia`, `_Responsables`, `_Salud` | `estudiantes.ver`, `.crear`, `.editar` | `MANUAL_EMPADRONAMIENTO.md`, `EMPADRONAMIENTO_TABLAS_BD.md` |
| Aprobar empadronamientos | Aprobaciones/Index, Aprobar, Devolver | `Views/Aprobaciones/Index` | `empadronamiento.aprobar` | `MATRICULA_ESTUDIANTE.md` |
| Entrada del empadronamiento público | EmpadronamientoPublicoInicio/Index (`/Empadronamiento/Publico`) | `Views/EmpadronamientoPublicoInicio/Index` | Pública | `AUTO_EMPADRONAMIENTO_PUBLICO.md` |
| Empadronamiento público (cinco pasos) | `/Empadronamiento/Publico/{código de institución}`: Index, Iniciar, Paso1 a Paso5, Finalizar, Confirmacion | `Views/EmpadronamientoPublico/`, `Views/Shared/_LayoutEmpadronamientoPublico` | Pública | `MANUAL_USUARIO_EMPADRONAMIENTO.md` |
| Activar el empadronamiento público | Instituciones/ConfigurarEmpadronamiento; Admin/Configuracion/ActualizarEmpadronamientoPublico | `Views/Instituciones/Details`, `Areas/Admin/Views/Configuracion/Index` | Rol SuperAdmin | |

### C09 Matrícula (Claude, capítulo modelo)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Listado de matrícula | Matricula/Index | `Views/Matricula/Index` | `matricula.ver` | `MATRICULA_ESTUDIANTE.md`, `ROADMAP_MATRICULA.md` |
| Matricular a un estudiante | Matricula/Nueva, Matricular | `Nueva` | `matricula.crear` (fuera de plazo: `matricula.extraordinaria`) | |
| Detalle de una matrícula | Matricula/Detalle, InscribirMateria, RetirarMateria, ConfirmarMaterias, FormalizarEspera | `Detalle` | `matricula.ver`, `matricula.crear` | |
| Cambio de sección e intercambio | Matricula/CambiarSeccion, Intercambiar | `Detalle` | `matricula.cambiar_seccion` | |
| Cerrar una matrícula | Matricula/Cerrar | `Detalle` | `matricula.anular` | |
| Comprobante | Matricula/Comprobante | (PDF) | `matricula.ver` | |
| Rematrícula | Matricula/Rematricula, AbrirRematricula, MarcarRepitente, QuitarPropuesta, ConfirmarRematricula | `Rematricula` | `matricula.crear`; quitar propuesta: `matricula.anular` | |
| Configuración de matrícula | Matricula/Configuracion, GuardarCupo, EliminarCupo, GuardarRematricula, GuardarPortal | `Configuracion` | `matricula.configurar` | `INSTRUCCIONES_LOTE_8.md` |
| Carreras y planes de estudio | Carreras/Index, Detalle, Guardar, GuardarPlan, AgregarMateria, QuitarMateria | `Views/Carreras/Index`, `Detalle` | `matricula.configurar` | |
| Matrículas en la ficha del estudiante | Estudiantes/Details | `Views/Estudiantes/_MatriculasEstudiante` | `matricula.ver` | |

### C10 Horarios (Codex)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Horarios de clases | Horarios/Index, Details, Create, Edit, Delete, ToggleActivo, GetConflictos | `Views/Horarios/` con `_Formulario` | Solo sesión (menú: `asistencia.ver`) | `modulo_asistencia_mep.md` |
| Horario semanal | Horarios/HorarioSemanal | `HorarioSemanal` | Solo sesión | |
| Horario en la ficha del estudiante | Estudiantes/Details | `Views/Estudiantes/_HorarioEstudiante` | `estudiantes.ver` | |

### C11 Asistencia (Claude-S)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Tomar asistencia por lección | AsistenciaLeccion/Index, TomarAsistencia, GuardarAsistencia, ActualizarEstado, Historial | `Views/AsistenciaLeccion/` | Solo sesión (menú: `asistencia.ver`) | `modulo_asistencia_mep.md` |
| Estadísticas de asistencia | AsistenciaLeccion/Estadisticas | `Estadisticas` | Solo sesión | |
| Reporte de ausencias | AsistenciaLeccion/Ausencias | `Ausencias` | Solo sesión | |
| Asistencia diaria | Asistencia/Index, PaseLista, GuardarAsistencia | `Views/Asistencia/Index`, `PaseLista` | `asistencia.ver`, `asistencia.tomar_asistencia` | |
| Resumen, impresión y exportación | Asistencia/Resumen, ImprimirResumen, ExportarExcel | `Resumen`, `ResumenPdf` | `asistencia.ver_resumen`, `.imprimir`, `.exportar` | |
| Asistencia en la ficha del estudiante | Estudiantes/Details | `Views/Estudiantes/_AsistenciaEstudiante` | `estudiantes.ver` | |

### C12 Rúbricas e instrumentos (Codex)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Rúbricas | Rubricas/Index, Details, Create, Edit, Delete, Duplicar, ExportarExcel | `Views/Rubricas/`: la lista es `IndexWithPermissions` con `_List`; además `_Fields`, `_Facts`, `_Messages` | Solo sesión (menú: `rubricas.ver` o `.ver_todas`) | `DATOS_SEMILLA_RUBRICAS.md` |
| Valores y niveles de una rúbrica | Rubricas/GestionarValoresItems, AsignarNivelesAutomatico, AsignarNivelesPersonalizado, ConfigureQualificationLevels | `GestionarValoresItems`, `ConfigureQualificationLevels` | Solo sesión | |
| Compartir una rúbrica | Rubricas/Compartir, CambiarPermisoCompartida, DejarDeCompartir | `Compartir` | `rubricas.compartir` | |
| Importar rúbricas desde Excel | ImportarRubrica/Index, ImportarExcel | `Views/ImportarRubrica/Index` (se abre desde la lista de rúbricas) | Solo sesión | `PLANTILLA_IMPORTACION_RUBRICAS.md` |
| Ítems de evaluación | ItemsEvaluacion/Index, Details, Create, Edit, Delete | `Views/ItemsEvaluacion/` | `items_evaluacion.ver`, `.crear`, `.editar`, `.eliminar` | |
| Niveles de calificación | NivelesCalificacion/Index, Details, Create, Edit, Delete | `Views/NivelesCalificacion/` con `_LevelEditor`, `_LevelFacts` | `niveles.ver`, `.crear`, `.editar`, `.eliminar` | |
| Grupos de calificación | GruposCalificacion/Index, Details, Create, Edit, Delete, AssignLevels, CrearGrupoRapido | `Views/GruposCalificacion/`, `Views/Shared/_ModalCrearGrupoRapido` (se abre al crear una rúbrica) | `niveles.ver`, `.crear`, `.editar`, `.eliminar` | |
| Valores de rúbricas | ValorRubrica/Index, Details, Create, Edit, Delete, ConfigurarRubrica | `Views/ValorRubrica/` con `_Editor`, `_Facts` | `rubricas.ver`, `.editar`, `.eliminar` (el menú pide `niveles.ver`) | |
| Instrumentos de evaluación | InstrumentosEvaluacion/Index, Details, Create, Edit, Delete | `Views/InstrumentosEvaluacion/` | `instrumentos_evaluacion.ver`, `.crear`, `.editar`, `.eliminar` | |
| Asignar rúbricas a instrumentos | InstrumentoRubrica/Index, Details, Create, Edit, Delete, ByInstrumento, ByRubrica, AsignarMateria | `Views/InstrumentoRubrica/` | Index: `instrumento_rubrica.ver`; lo demás solo sesión | |
| Asignar instrumentos a materias | InstrumentoMaterias/Index, Details, Create, Edit, Delete | `Views/InstrumentoMaterias/` con `_Peso` | `instrumento_materias.ver`, `.ver_detalles`, `.crear`, `.editar`, `.eliminar` | |

### C13 Evaluaciones y cuaderno calificador (Codex)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Evaluaciones | Evaluaciones/Index, Details, Create, Edit, Delete | `Views/Evaluaciones/` (sin `Reportes23-07-2025`) | Solo sesión (menú: `evaluaciones.ver`, `.crear`); el alcance usa `evaluaciones.ver_todas` | |
| Enviar evaluaciones por correo | Evaluaciones/EnviarEvaluacion, EnviarTodasEvaluaciones | `Index`, `Details` | Solo sesión | |
| Cuaderno calificador | CuadernoCalificador/Index, EstadisticasRapidas, ExportarExcelDinamico | `Views/CuadernoCalificador/Index` | `cuaderno_calificador.ver`, `.exportar_dinamico` | |
| Cuaderno tradicional | CuadernoCalificador/Tradicional | `Tradicional` | `cuaderno_calificador.ver_tradicional` | |
| Cuaderno automático PQ2025 | CalificadorPQ2025/Index, Generar, ExportarCsv, Estadisticas | `Views/CalificadorPQ2025/Index`, `CuadernoGrid` | Solo sesión (menú: `cuaderno_calificador.ver`) | |
| Reporte SEA (MEP) | SEA/Index, ExportarCSV, ExportarExcel, ExportarPDF, ValidarPonderaciones | `Views/SEA/Index` | `sea.ver_reporte`, `.exportar_csv`, `.exportar_excel`, `.exportar_pdf` | |
| Configurar el reporte SEA | SEA/Configurar | `Configurar` | `sea.configurar` | |

### C14 Conducta (Claude-S)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Dashboard de conducta | NotaConducta/Dashboard | `Views/NotaConducta/Dashboard` | Solo sesión (menú: rol SuperAdmin, Admin, Coordinador o Profesor) | `MODULO_CONDUCTA.md` |
| Boletas de conducta | BoletasConducta/Index, Create, Details, Anular, ReenviarNotificacion | `Views/BoletasConducta/` | Solo sesión | |
| Nota de conducta del estudiante | NotaConducta/EstudianteNota, RecalcularNota | `EstudianteNota` | Solo sesión | |
| Estudiantes en riesgo y aplazados | NotaConducta/EstudiantesRiesgo, EstudiantesAplazados | `EstudiantesRiesgo`, `EstudiantesAplazados` | Solo sesión | |
| Programas de acciones | ProgramaAcciones/Index, Details, Create, Edit, Delete, Verificar, ExportarProgramas; NotaConducta/CrearPrograma | `Views/ProgramaAcciones/`, `Views/NotaConducta/CrearPrograma` | Solo sesión | |
| Decisión profesional | NotaConducta/AplicarDecisionProfesional | `AplicarDecisionProfesional` | Solo sesión | |
| Reportes PDF de conducta | NotaConducta/ReporteProgramaAcciones, ReporteDecisionProfesional, ReporteMasivoProgramasAcciones, ReporteMasivoDecisionesProfesionales | `ReporteProgramaAcciones`, `ReporteDecisionProfesional`, `ReporteMasivoProgramas`, `ReporteMasivoDecisiones` | Solo sesión | `REPORTES_PDF_CONDUCTA.md` |
| Historial por estudiante | Reportes/SeleccionarEstudiante, HistorialConductaEstudiante, ExportarHistorial | `Views/Reportes/SeleccionarEstudiante`, `HistorialConductaEstudiante` | Solo sesión | |
| Reporte general de conducta | Reportes/ReporteGeneralConducta, ExportarReporteGeneral | `Views/Reportes/ReporteGeneralConducta` | Solo sesión | |

### C15 Reportes y exportaciones (Codex)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Centro de reportes | Reportes/Index | `Views/Reportes/Index` | Solo sesión (menú: rol o `reportes.ver_basicos`) | |
| Reporte en árbol | Reportes/ArbolEvaluaciones, ExportarArbolExcel, ExportarArbolCSV | `ArbolEvaluaciones` | Solo sesión | |
| Dashboard general | Reportes/Dashboard | `Dashboard` | Solo sesión | |
| Reportes de evaluaciones | Evaluaciones/Reportes | `Views/Evaluaciones/Reportes` | Solo sesión | |
| Reporte de coordinación | ReporteCoordinacion/Index | `Views/ReporteCoordinacion/Index` | Rol SuperAdmin, Admin o Coordinador | `ANALISIS_COORDINADOR_PROFESORES_A_CARGO.md` |
| Reportes de gestión | ReportesGestion/Avance, CargaDocente, Alertas, Comparativo | `Views/ReportesGestion/` | Rol SuperAdmin, Admin o Coordinador | |
| Calidad de los datos | ReportesGestion/CalidadDatos | `CalidadDatos` | Rol SuperAdmin o Admin | |
| Exportar calificaciones | Exportaciones/Index, Nueva, Preparar, Procesar, Eliminar | `Views/Exportaciones/Index`, `Asistente` | `exportaciones.ver`, `exportaciones.crear` | |
| Encabezado institucional de los reportes | (parcial) | `Views/Shared/_EncabezadoReporte` | | `PERSONALIZACION_POR_INSTITUCION.md` |

El cuaderno calificador y el reporte SEA aparecen también en el menú Reportes; se documentan en C13 y aquí solo se enlazan.

### C16 Auditoría (Claude-S)

| Pantalla | Ruta | Archivos fuente | Permiso | Apoyo |
|---|---|---|---|---|
| Historial de auditoría | Auditoria/Index, Detalles, HistorialGrupo | `Views/Auditoria/` con `_Historial` | `auditoria.ver` | |
| Auditoría del sistema | Admin/Audit: Index, Details, UserActivity | `Areas/Admin/Views/Audit/Index`, `Details` | Rol SuperAdmin y `auditoria.ver` | |
| Estadísticas, exportación y limpieza | Admin/Audit: Statistics, Dashboard, Export, Cleanup | `Areas/Admin/Views/Audit/Index` | `auditoria.ver_metricas`, `.exportar`, `.limpiar` | |

### C17 Flujos de punta a punta, C18 Preguntas frecuentes, C19 Glosario (Claude, MN6)

No tienen pantallas propias. Se escriben a partir de los capítulos C01 a C16. Documentos útiles para C17: `COMERCIAL/GUIA_DEMO.md` (recorrido de demostración), `MATRICULA_ESTUDIANTE.md` (flujo de matrícula), `INSTRUCCIONES_LOTE_7B.md`, `INSTRUCCIONES_LOTE_7C.md` e `INSTRUCCIONES_LOTE_8.md` (pasos de puesta en marcha).

## Pantallas que existen y no están en el menú (MN1.3)

### Entran al manual (se llega desde otra pantalla)

| Pantalla | Ruta | Cómo se llega | Capítulo |
|---|---|---|---|
| Elegir el período de trabajo | PeriodoAcademico/Seleccionar | Selector de período del panel de control | C02 |
| Recuperar contraseña | Account/ForgotPassword, ResetPassword | Enlace en la pantalla de inicio de sesión | C02 |
| Aceptar invitación | Account/AceptarInvitacion, Invitacion/Acceso | Enlace del correo de invitación | C02 |
| Solicitar institución | Account/SolicitarInstitucion | Portada pública | C02 |
| Entrada del empadronamiento público | EmpadronamientoPublicoInicio/Index | Portada pública | C08 |
| Grupos de calificación | GruposCalificacion/Index | Al crear una rúbrica (`Rubricas/Create`) | C12 |
| Importar rúbricas | ImportarRubrica/Index | Lista de rúbricas (`Rubricas/_List`) | C12 |
| Compartir rúbrica | Rubricas/Compartir | Lista o detalle de rúbricas | C12 |
| Rematrícula | Matricula/Rematricula | Listado de matrícula | C09 |
| Horario semanal | Horarios/HorarioSemanal | Horarios | C10 |
| Historial de asistencia por lección | AsistenciaLeccion/Historial | Tomar asistencia por lección | C11 |
| Resumen de asistencia diaria | Asistencia/Resumen | Asistencia diaria | C11 |
| Cuaderno tradicional | CuadernoCalificador/Tradicional | Cuaderno calificador | C13 |
| Configurar SEA | SEA/Configurar | Reporte SEA | C13 |
| Vincular profesor con usuario | Profesores/VincularUsuario | Detalle del profesor | C06 |
| Reporte de escuelas | Escuelas/Reporte | Escuelas | C05 |
| Simulación de borrado de institución | Instituciones/SimularBorrado | Detalle de la institución | C04 |

### No entran al manual (pruebas, diagnóstico o código sin uso)

| Controlador | Qué es | Acceso |
|---|---|---|
| Asistencias | Módulo de asistencia anterior, con vistas completas y sin ningún enlace desde otra pantalla | Solo sesión |
| Home: CrearDatosBasicos, CrearDatosEjemplo, VerificarEstadoSistema, DiagnosticarRubrica, ListarRubricas, AsociarNivelesComunes, DiagnosticarRubrica9, EliminarRubrica9, VerificarYCrearDatosGrupos, DebugPermisos, DebugRoles | Utilidades de diagnóstico y datos de ejemplo | Rol SuperAdmin |
| DebugGrupos, DiagnosticoGrupos, GruposEstudiantesTest, Test, TestGrupos, TestImport | Pantallas de prueba | Rol SuperAdmin |
| GruposEstudiantes: DiagnosticoCreacion, DebugEstudiantes | Diagnóstico | Rol SuperAdmin |
| Asistencia/Diagnostico; CuadernoCalificador/DiagnosticoPonderaciones; Rubricas/DiagnosticarItems; ImportarRubrica/DiagnosticarEsquema, TestCrearValor | Diagnóstico | Con sesión o permiso propio |
| PeriodosAcademicos: Ofertas, CrearOferta, CerrarOferta | Acciones sin vista (`Ofertas.cshtml` y `CrearOferta.cshtml` no existen) y sin enlace desde ninguna pantalla; ver `PENDIENTE_CONFIRMAR.md`, punto 4 | `periodos.ver`, `.crear`, `.editar` |
| DiagnosticoController.cs, TestDebugController.cs | Archivos vacíos | |

### Vistas sin acción que las use (candidatas a limpieza, no se documentan)

`CuadernoCalificador/Crear`, `Ver`, `ConfigurarInstrumentos`; `Estudiantes/ConfigurarACS`; `Materias/IndexNew`, `DetailsNew`, `EditNew`; `Rubricas/Index` (la lista usa `IndexWithPermissions`); `Evaluaciones/Reportes23-07-2025`; `TestDebug/TestMateria`; los archivos con sufijo `-bk` o `bk` en `GruposEstudiantes` y `TiposGrupo`. La comprobación fue por nombre de acción; puede haber alguna que se devuelva con `View("Nombre")`.

## Documentos de `DOCS/` por capítulo

| Capítulo | Documentos aprovechables |
|---|---|
| C01 | `COMERCIAL/FICHA_TECNICA.md`, `COMERCIAL/PROPUESTA_COMERCIAL.md`, `COMERCIAL/GUIA_DEMO.md`, `SPEC_PORTADA_PUBLICA.md`, `PortalEstudiante/INDICE_DOCUMENTACION_WEB_MOVIL.md` |
| C02 | `IMPLEMENTACION_GOOGLE_OAUTH.md`, `PortalEstudiante/RESUMEN_PWA_ANDROID_IPHONE.md` |
| C03 | `Guia-Prueba-Admin-Users.md`, `INSTRUCCIONES_ADMIN_SEEDING.md`, `architecture/sesion-2026-08-10-multitenancy-permisos.md`, `architecture/matriz-datascope.md` |
| C04 | `PERSONALIZACION_POR_INSTITUCION.md`, `MODULO_SLIDER_DINAMICO.md`, `ENVIRONMENT_CONFIG.md`, `MONITOREO_Y_RESPALDO.md` |
| C05 | `ANALISIS_COORDINADOR_PROFESORES_A_CARGO.md` |
| C06 | `DELETE_PROFESOR_CASCADE.md`, `FAQ_DELETE_PROFESOR.md`, `FLUJO_DELETE_CASCADE.md` |
| C07 | `ANALISIS_PERFIL_ESTUDIANTE.md` |
| C08 | `MANUAL_USUARIO_EMPADRONAMIENTO.md` (para el estudiante), `MANUAL_EMPADRONAMIENTO.md` (para el personal), `AUTO_EMPADRONAMIENTO_PUBLICO.md`, `EMPADRONAMIENTO_TABLAS_BD.md` |
| C09 | `MATRICULA_ESTUDIANTE.md`, `ROADMAP_MATRICULA.md`, `INSTRUCCIONES_LOTE_8.md` |
| C10 y C11 | `modulo_asistencia_mep.md` (es un diseño, no un manual) |
| C12 | `PLANTILLA_IMPORTACION_RUBRICAS.md`, `DATOS_SEMILLA_RUBRICAS.md` |
| C13 | Ninguno específico |
| C14 | `MODULO_CONDUCTA.md`, `REPORTES_PDF_CONDUCTA.md` |
| C15 | `ANALISIS_COORDINADOR_PROFESORES_A_CARGO.md` |
| C16 | Ninguno específico |

No sirven para el manual de usuario (son de despliegue, base de datos o desarrollo): `DEPLOY_*.md`, `GUIA_PUBLICACION_IIS.md`, `PUBLICACION_IIS.md`, `RENDER_CONFIG.md`, `RESET_ADMIN_PASSWORD.md`, `SOLUCION_IDENTITY_ERROR.md`, `ARQUITECTURA_ANALISIS_NCAPAS.md`, `ALMACENAMIENTO_ARCHIVOS_SUBIDOS_IIS.md`, `URLS_PRUEBAS.md`, `PLAN_MEJORA_UI.md`, `REVISION_LOTE_*.md`. Varios mencionan credenciales o SQLite: no copiar nada de ahí.

## Cambios propuestos frente al roadmap

| Capítulo | Cambio | Motivo |
|---|---|---|
| C01 | Agrega una sección corta que presenta el portal del estudiante | Decisión MN0.1; el roadmap no tenía dónde ponerla |
| C02 | Agrega recuperar contraseña, aceptar invitación, solicitar institución y elegir el período de trabajo | Existen en el código y son pasos de entrada |
| C03 | Queda con el área de administración (usuarios, roles, permisos), "Usuarios" del menú principal e invitaciones | Sin cambio de alcance; se precisa |
| C04 | Agrega la configuración del sistema (`Admin/Configuracion`: general, seguridad, correo, registros, modo de registro) y "ver el sistema como una institución" | No estaban en ningún capítulo |
| C05 | Pierde Tipos de formación académica (pasa a C06). Agrega la asignación de coordinadores y profesores a cargo | El menú pone los tipos de formación bajo Profesores |
| C06 | Recibe Tipos de formación académica y vincular profesor con usuario | Igual |
| C08 | Agrega cómo se activa el empadronamiento público por institución | Sin eso el flujo público no se entiende |
| C09 | Agrega rematrícula y el interruptor de matrícula desde el portal | Existen en `MatriculaController` |
| C11 | Cubre dos módulos: asistencia por lección y asistencia diaria. El controlador `Asistencias` (anterior) queda fuera | Ver `PENDIENTE_CONFIRMAR.md`, punto 3 |
| C12 | Agrega grupos de calificación, importar rúbricas y compartir rúbricas | No están en el menú, se llega desde rúbricas |
| C13 | Agrega el Cuaderno Automático PQ2025 | Está en el menú y no en el roadmap |
| C14 | Agrega los dos reportes de conducta que viven en `ReportesController` | El menú Conducta los enlaza |
| C16 | Cubre dos pantallas: historial de auditoría (menú principal) y auditoría del área de administración | Son controladores distintos |

Sin cambios: C07, C10, C15, C17, C18 y C19.

## Anexo: todos los permisos de `ApplicationPermissions.cs`

Generado por búsqueda en `Controllers/`, `Areas/`, `Views/`, `Services/`, `Filters/`, `Authorization/`, `ViewComponents/` y `Extensions/`. "menú" es `Views/Shared/_Layout.cshtml`. Un permiso "sin uso" está definido y aparece en la matriz de permisos, pero ninguna pantalla lo exige: el manual no debe prometer que hace algo.

Los alias `Usuarios.View`, `Create`, `Edit`, `Delete` y `Auditoria.View`, `ViewStatistics`, `Export`, `Cleanup` apuntan a las constantes en mayúsculas y no se listan aparte.

Permisos definidos: 224. Sin uso en controladores, vistas ni servicios: 99.

### Usuarios (capítulo C03)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `usuarios.ver` | Admin/Roles, Admin/Users |
| CREAR | `usuarios.crear` | Admin/Users |
| EDITAR | `usuarios.editar` | Admin/Users |
| ELIMINAR | `usuarios.eliminar` | Admin/Users |
| BLOQUEAR | `usuarios.bloquear` | Sin uso en el código (solo definido) |
| CAMBIAR_ROLES | `usuarios.cambiar_roles` | Sin uso en el código (solo definido) |
| VER_PERFIL_COMPLETO | `usuarios.ver_perfil_completo` | Sin uso en el código (solo definido) |
| EXPORTAR | `usuarios.exportar` | Sin uso en el código (solo definido) |
| IMPORTAR | `usuarios.importar` | Sin uso en el código (solo definido) |
| ManageRoles | `usuarios.gestionar_roles` | Sin uso en el código (solo definido) |
| ManagePermissions | `usuarios.gestionar_permisos` | Sin uso en el código (solo definido) |
| ResetPassword | `usuarios.restablecer_contraseña` | Sin uso en el código (solo definido) |

### Rubricas (capítulo C12)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `rubricas.ver` | ValorRubrica, Views/Home/Index.cshtml, menú |
| VER_TODAS | `rubricas.ver_todas` | menú |
| CREAR | `rubricas.crear` | Views/Home/Index.cshtml |
| EDITAR | `rubricas.editar` | ValorRubrica |
| EDITAR_TODAS | `rubricas.editar_todas` | Sin uso en el código (solo definido) |
| ELIMINAR | `rubricas.eliminar` | ValorRubrica |
| ELIMINAR_TODAS | `rubricas.eliminar_todas` | Sin uso en el código (solo definido) |
| DUPLICAR | `rubricas.duplicar` | Sin uso en el código (solo definido) |
| PUBLICAR | `rubricas.publicar` | Sin uso en el código (solo definido) |
| ARCHIVAR | `rubricas.archivar` | Sin uso en el código (solo definido) |
| COMPARTIR | `rubricas.compartir` | Rubricas |
| EXPORTAR | `rubricas.exportar` | Sin uso en el código (solo definido) |
| IMPORTAR | `rubricas.importar` | Sin uso en el código (solo definido) |

### Evaluaciones (capítulo C13)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `evaluaciones.ver` | Views/Home/Index.cshtml, menú |
| VER_TODAS | `evaluaciones.ver_todas` | Services/Evaluaciones/AlcanceEvaluacionService.cs |
| CREAR | `evaluaciones.crear` | Views/Home/Index.cshtml, menú |
| EDITAR | `evaluaciones.editar` | Sin uso en el código (solo definido) |
| EDITAR_TODAS | `evaluaciones.editar_todas` | Sin uso en el código (solo definido) |
| ELIMINAR | `evaluaciones.eliminar` | Sin uso en el código (solo definido) |
| ELIMINAR_TODAS | `evaluaciones.eliminar_todas` | Sin uso en el código (solo definido) |
| EVALUAR | `evaluaciones.evaluar` | Sin uso en el código (solo definido) |
| REVISAR | `evaluaciones.revisar` | Sin uso en el código (solo definido) |
| APROBAR | `evaluaciones.aprobar` | Sin uso en el código (solo definido) |
| FINALIZAR | `evaluaciones.finalizar` | Sin uso en el código (solo definido) |
| REABRIR | `evaluaciones.reabrir` | Sin uso en el código (solo definido) |
| EXPORTAR | `evaluaciones.exportar` | Sin uso en el código (solo definido) |
| VER_RESULTADOS | `evaluaciones.ver_resultados` | Sin uso en el código (solo definido) |
| VER_ESTADISTICAS | `evaluaciones.ver_estadisticas` | Sin uso en el código (solo definido) |
| ITEMS_VER | `evaluaciones.items.ver` | Sin uso en el código (solo definido) |
| ITEMS_CREAR | `evaluaciones.items.crear` | Sin uso en el código (solo definido) |
| ITEMS_EDITAR | `evaluaciones.items.editar` | Sin uso en el código (solo definido) |
| ITEMS_ELIMINAR | `evaluaciones.items.eliminar` | Sin uso en el código (solo definido) |

### ItemsEvaluacion (capítulo C12)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `items_evaluacion.ver` | ItemsEvaluacion, Views/Home/Index.cshtml, menú |
| CREAR | `items_evaluacion.crear` | ItemsEvaluacion |
| EDITAR | `items_evaluacion.editar` | ItemsEvaluacion |
| ELIMINAR | `items_evaluacion.eliminar` | ItemsEvaluacion |
| DUPLICAR | `items_evaluacion.duplicar` | Sin uso en el código (solo definido) |
| IMPORTAR | `items_evaluacion.importar` | Sin uso en el código (solo definido) |
| EXPORTAR | `items_evaluacion.exportar` | Sin uso en el código (solo definido) |
| REORDENAR | `items_evaluacion.reordenar` | Sin uso en el código (solo definido) |
| GESTIONAR_CATEGORIAS | `items_evaluacion.gestionar_categorias` | Sin uso en el código (solo definido) |

### InstrumentosEvaluacion (capítulo C12)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `instrumentos_evaluacion.ver` | InstrumentosEvaluacion, Views/Home/Index.cshtml, menú |
| CREAR | `instrumentos_evaluacion.crear` | InstrumentosEvaluacion, Views/InstrumentosEvaluacion/Index.cshtml |
| EDITAR | `instrumentos_evaluacion.editar` | InstrumentosEvaluacion, Views/InstrumentosEvaluacion/Details.cshtml, Views/InstrumentosEvaluacion/Index.cshtml |
| ELIMINAR | `instrumentos_evaluacion.eliminar` | InstrumentosEvaluacion, Views/InstrumentosEvaluacion/Details.cshtml, Views/InstrumentosEvaluacion/Index.cshtml |
| DUPLICAR | `instrumentos_evaluacion.duplicar` | Sin uso en el código (solo definido) |
| ASIGNAR_MATERIAS | `instrumentos_evaluacion.asignar_materias` | Sin uso en el código (solo definido) |
| ACTIVAR_DESACTIVAR | `instrumentos_evaluacion.activar_desactivar` | Sin uso en el código (solo definido) |
| GESTIONAR_CONFIGURACION | `instrumentos_evaluacion.gestionar_configuracion` | Sin uso en el código (solo definido) |
| EXPORTAR | `instrumentos_evaluacion.exportar` | Sin uso en el código (solo definido) |
| IMPORTAR | `instrumentos_evaluacion.importar` | Sin uso en el código (solo definido) |
| VER_ESTADISTICAS | `instrumentos_evaluacion.ver_estadisticas` | Sin uso en el código (solo definido) |
| PUBLICAR | `instrumentos_evaluacion.publicar` | Sin uso en el código (solo definido) |

### Estudiantes (capítulo C07 y C08)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `estudiantes.ver` | Estudiantes, Empadronamiento, Views/Home/Index.cshtml, menú |
| CREAR | `estudiantes.crear` | Estudiantes, Empadronamiento |
| EDITAR | `estudiantes.editar` | Estudiantes, Empadronamiento |
| ELIMINAR | `estudiantes.eliminar` | Estudiantes |
| IMPORTAR | `estudiantes.importar` | Estudiantes |
| EXPORTAR | `estudiantes.exportar` | Estudiantes |
| VER_HISTORIAL | `estudiantes.ver_historial` | Sin uso en el código (solo definido) |
| VER_NOTAS | `estudiantes.ver_notas` | Sin uso en el código (solo definido) |
| EDITAR_NOTAS | `estudiantes.editar_notas` | Sin uso en el código (solo definido) |

### Instituciones (capítulo C04 y C05)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `instituciones.ver` | Facultades, Instituciones, Escuelas, menú |
| CREAR | `instituciones.crear` | Facultades, Instituciones, Escuelas, menú, Views/Escuelas/Index.cshtml, Views/Facultades/Details.cshtml y 3 más |
| EDITAR | `instituciones.editar` | Facultades, Instituciones, Escuelas, Views/Escuelas/Index.cshtml, Views/Facultades/Details.cshtml, Views/Facultades/Index.cshtml y 2 más |
| ELIMINAR | `instituciones.eliminar` | Facultades, Instituciones, Escuelas, Views/Escuelas/Index.cshtml, Views/Facultades/Details.cshtml, Views/Facultades/Index.cshtml |
| VER_DETALLES | `instituciones.ver_detalles` | Instituciones, Views/Instituciones/Index.cshtml |
| EXPORTAR | `instituciones.exportar` | Sin uso en el código (solo definido) |

### Invitaciones (capítulo C03)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `invitaciones.ver` | Invitaciones, menú |
| CREAR | `invitaciones.crear` | Invitaciones, Views/Invitaciones/Index.cshtml |
| REVOCAR | `invitaciones.revocar` | Invitaciones, Views/Invitaciones/Index.cshtml |

### Profesores (capítulo C06)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `profesores.ver` | menú |
| CREAR | `profesores.crear` | menú |
| EDITAR | `profesores.editar` | Sin uso en el código (solo definido) |
| ELIMINAR | `profesores.eliminar` | Sin uso en el código (solo definido) |
| VER_DETALLES | `profesores.ver_detalles` | Sin uso en el código (solo definido) |
| IMPORTAR | `profesores.importar` | Sin uso en el código (solo definido) |
| EXPORTAR | `profesores.exportar` | Sin uso en el código (solo definido) |
| VER_HISTORIAL | `profesores.ver_historial` | Sin uso en el código (solo definido) |
| ASIGNAR_GRUPOS | `profesores.asignar_grupos` | Sin uso en el código (solo definido) |
| GESTIONAR_HORARIOS | `profesores.gestionar_horarios` | Sin uso en el código (solo definido) |
| VER_ESTADISTICAS | `profesores.ver_estadisticas` | Sin uso en el código (solo definido) |
| CAMBIAR_ESTADO | `profesores.cambiar_estado` | Sin uso en el código (solo definido) |

### Reportes (capítulo C15)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER_BASICOS | `reportes.ver_basicos` | Views/Home/Index.cshtml, menú |
| VER_AVANZADOS | `reportes.ver_avanzados` | Views/Home/Index.cshtml |
| VER_TODOS | `reportes.ver_todos` | Views/Home/Index.cshtml |
| CREAR_PERSONALIZADOS | `reportes.crear_personalizados` | Sin uso en el código (solo definido) |
| EXPORTAR | `reportes.exportar` | Sin uso en el código (solo definido) |
| PROGRAMAR | `reportes.programar` | Sin uso en el código (solo definido) |
| VER_ESTADISTICAS_INSTITUCIONALES | `reportes.ver_estadisticas_institucionales` | Sin uso en el código (solo definido) |

### SEA (capítulo C13)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER_REPORTE | `sea.ver_reporte` | SEA |
| EXPORTAR_CSV | `sea.exportar_csv` | SEA, Views/SEA/Index.cshtml |
| EXPORTAR_EXCEL | `sea.exportar_excel` | SEA, Views/SEA/Index.cshtml |
| EXPORTAR_PDF | `sea.exportar_pdf` | SEA |
| CONFIGURAR | `sea.configurar` | SEA, Views/SEA/Index.cshtml |
| VER_ESTADISTICAS | `sea.ver_estadisticas` | Sin uso en el código (solo definido) |

### Configuracion (capítulo C03 y C04)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `configuracion.ver` | Home, Admin/Configuracion, menú, Authorization/PermissionPolicyProvider.cs |
| EDITAR_SISTEMA | `configuracion.editar_sistema` | Admin/Configuracion, Areas/Admin/Views/Configuracion/Index.cshtml, Authorization/PermissionPolicyProvider.cs |
| EDITAR_SEGURIDAD | `configuracion.editar_seguridad` | Admin/Configuracion, Areas/Admin/Views/Configuracion/Index.cshtml |
| GESTIONAR_ROLES | `configuracion.gestionar_roles` | Admin/Roles |
| GESTIONAR_PERMISOS | `configuracion.gestionar_permisos` | Admin/Permissions, Admin/Roles |
| BACKUP | `configuracion.backup` | Sin uso en el código (solo definido) |
| RESTAURAR | `configuracion.restaurar` | Sin uso en el código (solo definido) |
| VER_LOGS | `configuracion.ver_logs` | Admin/Configuracion, Areas/Admin/Views/Configuracion/Index.cshtml |
| LIMPIAR_LOGS | `configuracion.limpiar_logs` | Sin uso en el código (solo definido) |
| MODO_MANTENIMIENTO | `configuracion.modo_mantenimiento` | Admin/Configuracion |
| CONFIGURAR_EMAIL | `configuracion.configurar_email` | Admin/Configuracion, Areas/Admin/Views/Configuracion/Index.cshtml |
| Manage | `configuracion.gestionar` | Admin/Admin |
| Initialize | `configuracion.inicializar` | Admin/Admin |
| SyncPermissions | `configuracion.sincronizar_permisos` | Admin/Admin |
| HealthCheck | `configuracion.verificar_estado` | Admin/Admin, Admin/Configuracion |

### Auditoria (capítulo C16)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `auditoria.ver` | Auditoria, Admin/Audit, Views/Home/Index.cshtml, menú |
| VER_ACCESOS | `auditoria.ver_accesos` | Sin uso en el código (solo definido) |
| VER_CAMBIOS | `auditoria.ver_cambios` | Sin uso en el código (solo definido) |
| VER_ERRORES | `auditoria.ver_errores` | Sin uso en el código (solo definido) |
| EXPORTAR | `auditoria.exportar` | Admin/Audit, Areas/Admin/Views/Audit/Index.cshtml |
| LIMPIAR | `auditoria.limpiar` | Admin/Audit, Areas/Admin/Views/Audit/Index.cshtml |
| VER_METRICAS | `auditoria.ver_metricas` | Admin/Audit |

### Periodos (capítulo C05)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `periodos.ver` | PeriodosAcademicos, Views/Home/Index.cshtml, menú |
| CREAR | `periodos.crear` | PeriodosAcademicos, Views/PeriodosAcademicos/Index.cshtml |
| EDITAR | `periodos.editar` | PeriodosAcademicos, Views/PeriodosAcademicos/Details.cshtml, Views/PeriodosAcademicos/Index.cshtml |
| ELIMINAR | `periodos.eliminar` | PeriodosAcademicos, Views/PeriodosAcademicos/Details.cshtml, Views/PeriodosAcademicos/Index.cshtml |
| ACTIVAR | `periodos.activar` | PeriodosAcademicos |
| CERRAR | `periodos.cerrar` | PeriodosAcademicos |
| GESTIONAR_CALENDARIO | `periodos.gestionar_calendario` | PeriodosAcademicos |

### Niveles (capítulo C12)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `niveles.ver` | GruposCalificacion, NivelesCalificacion, Views/Home/Index.cshtml, menú |
| CREAR | `niveles.crear` | GruposCalificacion, NivelesCalificacion, Views/GruposCalificacion/Index.cshtml |
| EDITAR | `niveles.editar` | GruposCalificacion, NivelesCalificacion, Views/GruposCalificacion/Details.cshtml, Views/GruposCalificacion/Index.cshtml |
| ELIMINAR | `niveles.eliminar` | GruposCalificacion, NivelesCalificacion, Views/GruposCalificacion/Index.cshtml |
| REORDENAR | `niveles.reordenar` | Sin uso en el código (solo definido) |
| GESTIONAR_GRUPOS | `niveles.gestionar_grupos` | Sin uso en el código (solo definido) |

### TiposFormacionAcademica (capítulo C06)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `tipos_formacion_academica.ver` | TiposFormacionAcademica, menú |
| CREAR | `tipos_formacion_academica.crear` | TiposFormacionAcademica |
| EDITAR | `tipos_formacion_academica.editar` | TiposFormacionAcademica |
| ELIMINAR | `tipos_formacion_academica.eliminar` | TiposFormacionAcademica |

### Asistencia (capítulo C11)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `asistencia.ver` | Asistencia, menú |
| TOMAR_ASISTENCIA | `asistencia.tomar_asistencia` | Asistencia |
| EDITAR_ASISTENCIA | `asistencia.editar_asistencia` | Sin uso en el código (solo definido) |
| ELIMINAR_REGISTROS | `asistencia.eliminar_registros` | Sin uso en el código (solo definido) |
| VER_RESUMEN | `asistencia.ver_resumen` | Asistencia |
| IMPRIMIR | `asistencia.imprimir` | Asistencia |
| VER_DIAGNOSTICO | `asistencia.ver_diagnostico` | Asistencia |
| EXPORTAR | `asistencia.exportar` | Asistencia |
| GESTIONAR_GRUPOS | `asistencia.gestionar_grupos` | Sin uso en el código (solo definido) |
| VER_ESTADISTICAS | `asistencia.ver_estadisticas` | Sin uso en el código (solo definido) |
| CONFIGURAR_PARAMETROS | `asistencia.configurar_parametros` | Sin uso en el código (solo definido) |

### TiposGrupo (capítulo C05)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `tipos_grupo.ver` | TiposGrupo, Views/Home/Index.cshtml, menú |
| CREAR | `tipos_grupo.crear` | TiposGrupo, Views/TiposGrupo/Index.cshtml |
| EDITAR | `tipos_grupo.editar` | TiposGrupo, Views/TiposGrupo/Details.cshtml, Views/TiposGrupo/Index.cshtml |
| ELIMINAR | `tipos_grupo.eliminar` | TiposGrupo, Views/TiposGrupo/Details.cshtml, Views/TiposGrupo/Index.cshtml |
| VER_DETALLES | `tipos_grupo.ver_detalles` | TiposGrupo |
| CAMBIAR_ESTADO | `tipos_grupo.cambiar_estado` | TiposGrupo, Views/TiposGrupo/Index.cshtml |
| GESTIONAR | `tipos_grupo.gestionar` | Sin uso en el código (solo definido) |

### GruposEstudiantes (capítulo C07)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `grupos_estudiantes.ver` | GruposEstudiantes, Views/Home/Index.cshtml, menú |
| CREAR | `grupos_estudiantes.crear` | GruposEstudiantes |
| EDITAR | `grupos_estudiantes.editar` | GruposEstudiantes |
| ELIMINAR | `grupos_estudiantes.eliminar` | GruposEstudiantes |
| VER_DETALLES | `grupos_estudiantes.ver_detalles` | GruposEstudiantes |
| ASIGNAR_ESTUDIANTES | `grupos_estudiantes.asignar_estudiantes` | GruposEstudiantes |
| DESASIGNAR_ESTUDIANTES | `grupos_estudiantes.desasignar_estudiantes` | GruposEstudiantes |
| ASIGNAR_MATERIAS | `grupos_estudiantes.asignar_materias` | Sin uso en el código (solo definido) |
| DESASIGNAR_MATERIAS | `grupos_estudiantes.desasignar_materias` | Sin uso en el código (solo definido) |
| VER_ESTADISTICAS | `grupos_estudiantes.ver_estadisticas` | GruposEstudiantes |
| EXPORTAR | `grupos_estudiantes.exportar` | GruposEstudiantes |
| EXPORTAR_ESTUDIANTES | `grupos_estudiantes.exportar_estudiantes` | Sin uso en el código (solo definido) |
| GESTIONAR_ASIGNACIONES | `grupos_estudiantes.gestionar_asignaciones` | Sin uso en el código (solo definido) |

### Materias (capítulo C05)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `materias.ver` | Materias, Views/Home/Index.cshtml, menú |
| CREAR | `materias.crear` | Materias, Views/Materias/Index.cshtml |
| EDITAR | `materias.editar` | Materias, Views/Materias/Details.cshtml, Views/Materias/Index.cshtml |
| ELIMINAR | `materias.eliminar` | Materias, Views/Materias/Details.cshtml, Views/Materias/Index.cshtml |
| VER_DETALLES | `materias.ver_detalles` | Materias |
| ASIGNAR_INSTRUMENTOS | `materias.asignar_instrumentos` | Materias, Views/Materias/Details.cshtml, Views/Materias/Index.cshtml, Views/Materias/Instrumentos.cshtml |
| QUITAR_INSTRUMENTOS | `materias.quitar_instrumentos` | Materias, Views/Materias/AsignarInstrumentos.cshtml, Views/Materias/Instrumentos.cshtml |
| VER_INSTRUMENTOS | `materias.ver_instrumentos` | Materias, Views/Materias/Index.cshtml |
| GESTIONAR_ASIGNACIONES | `materias.gestionar_asignaciones` | Sin uso en el código (solo definido) |

### InstrumentoMaterias (capítulo C12)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `instrumento_materias.ver` | InstrumentoMaterias, Views/Home/Index.cshtml, menú |
| CREAR | `instrumento_materias.crear` | InstrumentoMaterias, Views/InstrumentoMaterias/Index.cshtml |
| EDITAR | `instrumento_materias.editar` | InstrumentoMaterias, Views/InstrumentoMaterias/Details.cshtml, Views/InstrumentoMaterias/Index.cshtml |
| ELIMINAR | `instrumento_materias.eliminar` | InstrumentoMaterias, Views/InstrumentoMaterias/Details.cshtml, Views/InstrumentoMaterias/Index.cshtml |
| VER_DETALLES | `instrumento_materias.ver_detalles` | InstrumentoMaterias |
| GESTIONAR_RELACIONES | `instrumento_materias.gestionar_relaciones` | Sin uso en el código (solo definido) |

### InstrumentoRubrica (capítulo C12)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `instrumento_rubrica.ver` | InstrumentoRubrica, Views/Home/Index.cshtml, menú |
| CREAR | `instrumento_rubrica.crear` | Sin uso en el código (solo definido) |
| EDITAR | `instrumento_rubrica.editar` | Sin uso en el código (solo definido) |
| ELIMINAR | `instrumento_rubrica.eliminar` | Sin uso en el código (solo definido) |
| VER_DETALLES | `instrumento_rubrica.ver_detalles` | Sin uso en el código (solo definido) |
| VER_POR_INSTRUMENTO | `instrumento_rubrica.ver_por_instrumento` | Sin uso en el código (solo definido) |
| VER_POR_RUBRICA | `instrumento_rubrica.ver_por_rubrica` | Sin uso en el código (solo definido) |
| ASIGNAR_MATERIA | `instrumento_rubrica.asignar_materia` | Sin uso en el código (solo definido) |
| GESTIONAR_RELACIONES | `instrumento_rubrica.gestionar_relaciones` | Sin uso en el código (solo definido) |

### Exportaciones (capítulo C15)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `exportaciones.ver` | Exportaciones, menú |
| CREAR | `exportaciones.crear` | Exportaciones, Views/Exportaciones/Index.cshtml |

### Coordinacion (capítulo C05)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| ASIGNAR | `coordinacion.asignar` | Facultades, Account, Escuelas |

### Matricula (capítulo C09)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `matricula.ver` | Estudiantes, Matricula, menú |
| CREAR | `matricula.crear` | Matricula |
| ANULAR | `matricula.anular` | Matricula |
| CAMBIAR_SECCION | `matricula.cambiar_seccion` | Matricula |
| EXTRAORDINARIA | `matricula.extraordinaria` | Matricula |
| CONFIGURAR | `matricula.configurar` | Matricula, Carreras, menú |

### Empadronamiento (capítulo C08)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| APROBAR | `empadronamiento.aprobar` | Aprobaciones, menú |

### CuadernoCalificador (capítulo C13)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER | `cuaderno_calificador.ver` | CuadernoCalificador, Views/Home/Index.cshtml, menú |
| VER_TRADICIONAL | `cuaderno_calificador.ver_tradicional` | CuadernoCalificador |
| EXPORTAR_EXCEL | `cuaderno_calificador.exportar_excel` | Sin uso en el código (solo definido) |
| EXPORTAR_DINAMICO | `cuaderno_calificador.exportar_dinamico` | CuadernoCalificador |
| GESTIONAR | `cuaderno_calificador.gestionar` | Sin uso en el código (solo definido) |

### Admin (capítulo C03)

| Constante | Valor | Dónde se exige o se consulta |
|---|---|---|
| VER_DASHBOARD | `admin.ver_dashboard` | Admin/Admin, Views/Home/Index.cshtml, menú |
| INICIALIZAR_SISTEMA | `admin.inicializar_sistema` | Sin uso en el código (solo definido) |
| SINCRONIZAR_PERMISOS | `admin.sincronizar_permisos` | Sin uso en el código (solo definido) |
| VER_ESTADISTICAS | `admin.ver_estadisticas` | Sin uso en el código (solo definido) |
| VERIFICAR_SALUD | `admin.verificar_salud` | Sin uso en el código (solo definido) |
| GESTIONAR_SISTEMA | `admin.gestionar_sistema` | Sin uso en el código (solo definido) |
| ACCESO_COMPLETO | `admin.acceso_completo` | Sin uso en el código (solo definido) |
