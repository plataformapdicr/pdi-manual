/* Se ejecuta dentro de la página antes de cada captura: reemplaza datos personales por ficticios. */
(() => {
  const NOM = ['Ana', 'Luis', 'María', 'José', 'Sofía', 'Daniel', 'Valeria', 'Andrés', 'Camila', 'Diego', 'Lucía', 'Pablo', 'Elena', 'Mateo', 'Isabel', 'Tomás', 'Paula', 'Gabriel', 'Laura', 'Sergio'];
  const APE = ['Mora', 'Solano', 'Vargas', 'Rojas', 'Jiménez', 'Castro', 'Araya', 'Quesada', 'Brenes', 'Chaves', 'Salas', 'Monge', 'Arias', 'Cordero', 'Villalobos', 'Campos', 'Núñez', 'Porras', 'Ulate', 'Segura'];
  /* Palabras de la interfaz o de instituciones: un texto que contenga alguna no se toma por nombre de persona. */
  const UI = new Set(('pdi plataforma docente integral super administrador administrador coordinador profesor profesora evaluador observador docente estudiante estudiantes ' +
    'inicio configuración profesores instituciones institución evaluaciones evaluación conducta reportes reporte panel control universidad colegio escuela instituto ' +
    'ficticio ficticia piloto norte sur técnico profesional nacional costa rica tecnológico prueba qa centro liceo sede facultad grupo grupos sección nivel materia ' +
    'curso rúbrica rúbricas tarea examen proyecto quiz trabajo cotidiano asistencia matrícula horario horarios activo activa inactivo inactiva aprobado aplazado ' +
    'pendiente borrador total promedio nota notas ver editar eliminar crear nuevo nueva guardar cancelar buscar filtrar exportar importar excel pdf csv sea mep ' +
    'lunes martes miércoles jueves viernes sábado domingo enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre i ii iii iv ' +
    'periodo período semestre cuatrimestre trimestre anual bimestre año todos todas mis mi resumen detalle detalles lista datos acción acciones estado tipo ' +
    'arquitectura computadoras programación matemática matemáticas español inglés ciencias estudios sociales física química biología historia música arte ' +
    'educación informática redes bases base software ingeniería administración contabilidad desarrollo web diseño gestión sistemas tecnología cívica ' +
    'anteproyecto laboratorio práctica investigación exposición portafolio ensayo prueba corta escrita oral final parcial guía guia empadronamiento auditoría ' +
    'académicos académico académica calificación calificaciones calificador calificadores formación solicitudes solicitud alta registro boletas boleta dashboard general ' +
    'cambiar contraseña número id sin adec adecuación confirmar eliminación filtros filtro búsqueda san alajuela cartago heredia limón puntarenas guanacaste ' +
    'escala escalas criterio criterios indicador indicadores valor valores ítem ítems item items componente componentes ponderación porcentaje puntos ' +
    'firma fecha hora lección lecciones aula salón jornada diurna nocturna mañana tarde noche semana día días mes meses ' +
    'usuarios usuario roles rol permisos permiso cuenta perfil salir sesión ayuda manual privacidad sql server rubricasdb env db desarrollo producción').split(/\s+/));
  const h = s => { let x = 0; for (const c of s) x = (x * 31 + c.charCodeAt(0)) >>> 0; return x; };
  const falso = (orig) => {
    const pal = orig.trim().split(/\s+/); const k = h(orig.toUpperCase());
    const out = [NOM[k % NOM.length]];
    if (pal.length >= 4) out.push(NOM[(k >>> 5) % NOM.length]);
    out.push(APE[(k >>> 3) % APE.length]);
    if (pal.length >= 3) out.push(APE[(k >>> 7) % APE.length]);
    let r = out.join(' ');
    if (orig === orig.toUpperCase()) r = r.toUpperCase();
    return r;
  };
  const palabra = /^[A-ZÁÉÍÓÚÑÜ][A-Za-zÁÉÍÓÚÑÜáéíóúñü'.]+$/;
  const conectores = new Set(['de', 'del', 'la', 'los', 'las', 'y']);
  /* ¿Es un nombre de persona? 2 a 6 palabras con mayúscula inicial (conectores de/del permitidos), ninguna de la interfaz. */
  /* Nombres y apellidos frecuentes en Costa Rica (sin tildes, en minúscula): un texto solo se toma por
     nombre de persona si al menos una de sus palabras está aquí. */
  const sinTilde = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[.,]/g, '');
  const PERS = new Set(('ana maria jose juan carlos luis jorge manuel francisco antonio pedro miguel rafael ricardo roberto alberto alejandro andres diego daniel david gabriel ' +
    'mario oscar sergio fernando eduardo javier pablo mateo santiago sebastian nicolas emiliano joaquin tomas samuel isaac adrian esteban felipe hector ivan marco marcos ' +
    'kevin bryan brandon josue jesus cristian christian alonso gerardo rodrigo victor william walter allan randall minor johnny jason steven erick erik dylan ian ' +
    'laura sofia valeria camila lucia paula elena isabel natalia gabriela fernanda patricia carolina andrea daniela mariana alejandra adriana monica silvia sandra ' +
    'veronica karla karen ximena jimena melanny melany valentina victoria fabiola paola raquel rebeca sara sarah tatiana viviana yesenia yorleny gloria rosa carmen ' +
    'teresa marta martha lorena giselle gisela susana beatriz cecilia diana emilia irene ivonne jessica johanna julia kimberly lisbeth luz margarita marcela mercedes ' +
    'nancy olga pamela priscilla priscila rocio roxana sonia stephanie tamara vanessa wendy yuliana angie ashley nicole abigail allison ' +
    'gonzalez rodriguez hernandez jimenez vargas mora rojas sanchez ramirez castro alvarado solis chaves araya morales quesada salazar campos herrera arias ' +
    'brenes calderon carvajal cordero fallas fernandez garcia gomez gutierrez lopez martinez mendez monge murillo navarro perez picado porras ramos rivera ' +
    'salas segura soto ulate umana valverde villalobos zuniga zuñiga badilla elizondo barquero esquivel matamoros pena peña mena leon alfaro madrigal marin ' +
    'mata montero mendoza miranda molina obando orozco ortiz pacheco retana rosales sibaja solano torres trejos ugalde vega venegas vindas tamayo castillo ' +
    'aguilar acuña acuna alpizar arce artavia bolaños bolanos bonilla cascante cerdas chacon cruz delgado duran espinoza flores fonseca granados guevara ' +
    'jara leiva lizano loria meza mojica montoya muñoz munoz naranjo ovares rivas sandi sequeira serrano siles valerio zamora zeledon ' +
    /* nombres de cuentas vistos en la base de desarrollo */
    'bashulspa estetica').split(/\s+/));
  const esNombre = t => {
    const pal = t.trim().split(/\s+/);
    if (pal.length < 2 || pal.length > 6) return false;
    let mayus = 0, conocidos = 0, ui = 0;
    for (const w of pal) {
      if (conectores.has(w.toLowerCase()) && w === w.toLowerCase()) continue;
      if (/^(Dr|Dra|Lic|Licda|MSc|Ing|Prof|Profa)\.?$/.test(w)) continue;
      if (!palabra.test(w)) return false;
      const b = sinTilde(w);
      if (UI.has(w.toLowerCase().replace(/[.,]/g, '')) || UI.has(b)) ui++;
      if (PERS.has(b)) conocidos++;
      mayus++;
    }
    /* Con dos o más nombres conocidos se toma por persona aunque lleve una palabra de la interfaz ("Carlos Ramirez Aplazado"). */
    return mayus >= 2 && (conocidos >= 2 || (conocidos >= 1 && ui === 0));
  };
  const EXCLUIR = 'nav, body > header, .navbar, .dropdown-menu, thead th, label.form-label, button, legend, .badge, .btn, .nav-link, .form-label, footer, select, option';
  /* Instituciones reales: se cambian por un nombre de ejemplo (las ficticias se dejan). */
  const INST = ['Colegio Técnico Profesional de Alajuela', 'Colegio Técnico Profesional de Cartago', 'Colegio Técnico Profesional de Heredia', 'Colegio Técnico Profesional de Liberia', 'Colegio Técnico Profesional de Limón', 'Colegio Técnico Profesional de Puntarenas',
    'Instituto Costarricense de Electricidad', 'Instituto de Desarrollo Profesional Uladislao Gámez Solano', 'Instituto Nacional de Aprendizaje', 'Tecnológico de Costa Rica', 'Universidad Americana', 'Universidad Central', 'Universidad de Costa Rica',
    'Universidad Estatal a Distancia', 'Universidad Fidélitas', 'Universidad Hispanoamericana', 'Universidad Internacional San Isidro Labrador', 'Universidad Latina de Costa Rica', 'Universidad Metropolitana Castro Carazo', 'Universidad Nacional',
    'Universidad San Marcos', 'Universidad Técnica Nacional', 'Institución de Prueba B (aislamiento)', 'Instituto QA Aprobar'].sort((a, b) => b.length - a.length);
  const SIGLAS = /\b(UCR|UNA|UNED|TEC|UTN|INA|ICE|UIA|UH|ULatina|ULACIT|CTP|IDP|UNADECA)\b/g;
  let permitirNombres = true;
  const reemplazarTexto = s => {
    let t = s;
    for (const n of INST) if (t.includes(n)) t = t.split(n).join('Institución de Ejemplo');
    t = t.replace(SIGLAS, 'IE');
    t = t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, 'usuario@ejemplo.cr');
    /* nombres extra (ocultar.local.txt, los inyecta capturar-auto.cjs) */
    for (const n of (window.__PDI_OCULTAR || [])) t = t.split(n).join('Usuario');
    t = t.replace(/\b\d-\d{3,4}-\d{3,4}\b/g, '1-0000-0000').replace(/\b\d{9,12}\b/g, '100000000');
    t = t.replace(/\b[2-8]\d{3}-?\d{4}\b/g, '8888-0000');
    /* segmentos separados por · - , | : ( ) */
    /* "Apellido Apellido, Nombre [Nombre]" completo */
    let coma = false;
    if (permitirNombres) t = t.replace(/([A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+(?: [A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+)+), ([A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+(?: [A-ZÁÉÍÓÚÑÜ][a-záéíóúñü]+)?)/g, (m, ap, no) => {
      if (!esNombre(ap) || UI.has(no.split(' ')[0].toLowerCase())) return m;
      coma = true;
      const k = h(m); return APE[k % APE.length] + ' ' + APE[(k >>> 4) % APE.length] + ', ' + NOM[(k >>> 8) % NOM.length];
    });
    if (permitirNombres && !coma) t = t.replace(/[^·\-,|:()\n\t]+/g, seg => {
      const core = seg.trim(); if (!core) return seg;
      if (esNombre(core)) return seg.replace(core, falso(core));
      /* "Apellido Apellido, Nombre" ya separado por coma: cada lado de 1 palabra no se toca */
      return seg;
    });
    return t;
  };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.parentElement && /^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement.tagName)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  const nodos = []; while (w.nextNode()) nodos.push(w.currentNode);
  for (const n of nodos) {
    permitirNombres = !n.parentElement.closest(EXCLUIR);
    const v = reemplazarTexto(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v;
  }
  permitirNombres = true;
  for (const el of document.querySelectorAll('input:not([type=hidden]), textarea')) {
    if (el.value) { const v = reemplazarTexto(el.value); if (v !== el.value) el.value = v; }
    if (el.placeholder) el.placeholder = reemplazarTexto(el.placeholder);
  }
  for (const el of document.querySelectorAll('option')) { const v = reemplazarTexto(el.text); if (v !== el.text) el.text = v; }
  for (const el of document.querySelectorAll('[title],[aria-label]')) {
    for (const a of ['title', 'aria-label']) if (el.getAttribute(a)) el.setAttribute(a, reemplazarTexto(el.getAttribute(a)));
  }
  /* iniciales del avatar del usuario */
  for (const el of document.querySelectorAll('*')) if (el.children.length === 0 && /^HE$/.test((el.textContent || '').trim())) el.textContent = 'UD';
  /* iniciales de avatares de personas: se recalculan con el nombre (ya ficticio) del título de la página */
  const titulo = document.querySelector('main h1, h1');
  if (titulo) {
    const ini = titulo.textContent.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase();
    for (const el of document.querySelectorAll('[class*="initials"], [class*="iniciales"], [class*="avatar"]'))
      if (el.children.length === 0 && /^[A-ZÁÉÍÓÚÑ]{1,3}$/.test(el.textContent.trim()) && el.textContent.trim() !== 'UD') el.textContent = ini;
  }
  /* fotos de perfil */
  for (const img of document.querySelectorAll('img')) if (/foto|avatar|perfil|photo/i.test(img.src + ' ' + img.className + ' ' + img.alt)) img.style.filter = 'blur(12px)';
})();
