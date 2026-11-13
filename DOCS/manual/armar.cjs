#!/usr/bin/env node
/*
 * armar.cjs: une plantilla.html con los capítulos de capitulos/ y produce un solo
 * manual-pdi.html que abre sin conexión. Sin dependencias (solo Node).
 *
 * Uso:   node DOCS/manual/armar.cjs [opciones]
 *   --sin-pendientes   no lista en el índice los capítulos que aún no existen
 *   --estricto         los avisos de glosario cuentan como errores
 *   --forzar           arma el manual aunque haya errores (para ver cómo va)
 *   --solo-revisar     revisa los capítulos y no escribe manual-pdi.html
 *
 * Comprobaciones (MN3.3): capítulos faltantes, etiquetas y clases no permitidas, etiquetas
 * sin cerrar, ids repetidos, enlaces internos rotos, estructura de capítulo y de tarea,
 * capturas mal numeradas, enlaces externos, emojis, credenciales evidentes y términos
 * fuera del glosario. Falla con una lista clara (código de salida 1).
 */
'use strict';
const fs = require('fs');
const path = require('path');

const AQUI = __dirname;
const DIR_CAP = path.join(AQUI, 'capitulos');
const ARGS = new Set(process.argv.slice(2));

/* Los 19 capítulos del roadmap. Los códigos son fijos. */
const PLAN = [
  ['C01', 'Visión general y mapa del sistema'], ['C02', 'Primeros pasos'], ['C03', 'Roles, permisos y usuarios'],
  ['C04', 'Plataforma e instituciones'], ['C05', 'Estructura académica'], ['C06', 'Profesores'],
  ['C07', 'Estudiantes y grupos'], ['C08', 'Empadronamiento'], ['C09', 'Matrícula'], ['C10', 'Horarios'],
  ['C11', 'Asistencia'], ['C12', 'Rúbricas e instrumentos'], ['C13', 'Evaluaciones y cuaderno calificador'],
  ['C14', 'Conducta'], ['C15', 'Reportes y exportaciones'], ['C16', 'Auditoría'],
  ['C17', 'Flujos de punta a punta'], ['C18', 'Preguntas frecuentes y solución de problemas'], ['C19', 'Glosario']
];

const ETIQUETAS = new Set('section h1 h2 h3 h4 p ul ol li strong em table caption thead tbody tr th td dl dt dd a span aside figure figcaption'.split(' '));
const CLASES = new Set('capitulo a-simple-vista conceptos tarea tema resumen boton campo ruta valor variante aviso nota consejo captura'.split(' '));
const CLASES_POR_ETIQUETA = {
  section: ['capitulo', 'a-simple-vista', 'conceptos', 'tarea', 'tema'],
  p: ['resumen', 'variante'],
  span: ['boton', 'campo', 'ruta', 'valor'],
  aside: ['aviso', 'nota', 'consejo'],
  figure: ['captura']
};
const ATRIBUTOS = { '*': ['id', 'class'], a: ['href'], section: ['data-codigo', 'data-titulo'], figure: ['data-captura'] };
const APARTADOS = ['Para qué sirve', 'Quién puede hacerla', 'Dónde está', 'Pasos', 'Qué pasa después', 'Errores frecuentes', 'Tareas relacionadas'];
const JERGA = ['controlador', 'endpoint', 'tenant', 'claim', 'viewmodel', 'base de datos', 'sql server', 'sqlite', 'api ', ' json', 'middleware', 'dbcontext'];
const TITULOS_CALLOUT = { aviso: 'Aviso', nota: 'Nota', consejo: 'Consejo' };

const errores = [];   // { capitulo, mensaje }
const avisos = [];
const err = (cap, msg) => errores.push({ cap, msg });
const avi = (cap, msg) => avisos.push({ cap, msg });

/* ---------------------------------------------------------------- Utilidades */
function leer(ruta) {
  const b = fs.readFileSync(ruta);
  const bom = b.length >= 3 && b[0] === 0xef && b[1] === 0xbb && b[2] === 0xbf;
  return { texto: b.toString('utf8').replace(/^﻿/, ''), bom };
}
function textoPlano(html) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
}
function escapar(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function linea(texto, indice) { return texto.slice(0, indice).split('\n').length; }

/* ---------------------------------------------------------------- Glosario */
function cargarGlosario() {
  const ruta = path.join(AQUI, 'glosario.md');
  if (!fs.existsSync(ruta)) { avi('glosario', 'No existe glosario.md: se omite la comprobación de términos.'); return []; }
  const filas = [];
  for (const fila of leer(ruta).texto.split('\n')) {
    if (!fila.startsWith('|') || /^\|[\s|-]+\|$/.test(fila)) continue;
    const celdas = fila.split('|').slice(1, -1).map(c => c.trim());
    if (celdas.length === 3 && !/^No use$/i.test(celdas[2])) filas.push(celdas);
  }
  const terminos = new Set(filas.map(c => c[0].toLowerCase()));
  /* Palabras que también se usan bien en otro sentido: no se vigilan solas. */
  const AMBIGUAS = new Set(['colegio', 'escuela', 'curso', 'grupo', 'prueba', 'falta', 'inicio', 'ciclo', 'confirmar', 'inscribir', 'inscripción', 'tutor', 'matrícula', 'empadronamiento', 'registro', 'actividad', 'examen', 'calificación', 'status', 'login', 'clic', 'salón', 'aula', 'programa', 'dashboard', 'seleccionar', 'ingresar', 'presionar', 'digitar', 'clase', 'perfil', 'baja', 'cola', 'pendientes de cupo', 'renovación', 'validación', 'criterio', 'modalidad']);
  const prohibidos = [];
  for (const c of filas) {
    const partes = []; let nivel = 0, actual = '';
    for (const ch of c[2]) { if (ch === '(') nivel++; if (ch === ')') nivel--; if (ch === ',' && nivel === 0) { partes.push(actual); actual = ''; } else actual += ch; }
    partes.push(actual);
    for (let v of partes) {
      if (/[()]/.test(v)) continue;
      v = v.trim().toLowerCase();
      if (v.length >= 5 && !terminos.has(v) && !AMBIGUAS.has(v)) prohibidos.push({ variante: v, termino: c[0] });
    }
  }
  return prohibidos;
}

/* ---------------------------------------------------------------- Revisión de un capítulo */
function revisar(codigo, archivo, html, glosario) {
  const cap = codigo;
  const pila = [];
  const ids = [], hrefs = [], capturas = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:\s+[^<>]*?)?)\s*(\/?)>/g;
  let m, h1 = 0;
  const sinEtiquetas = html.replace(/<!--[\s\S]*?-->/g, '');
  if (/<!--/.test(html)) avi(cap, 'Tiene comentarios HTML; no se incluyen en el manual.');
  while ((m = re.exec(sinEtiquetas))) {
    const [, cierra, nombre, attrs, autocierre] = m;
    const t = nombre.toLowerCase();
    const ln = linea(sinEtiquetas, m.index);
    if (!ETIQUETAS.has(t)) { err(cap, `línea ${ln}: etiqueta no permitida <${t}>.`); continue; }
    if (autocierre) { err(cap, `línea ${ln}: <${t}/> autocerrada; use etiqueta de apertura y cierre.`); continue; }
    if (cierra) {
      const top = pila.pop();
      if (top !== t) err(cap, `línea ${ln}: </${t}> no cierra a <${top || 'nada'}>.`);
      continue;
    }
    pila.push(t);
    if (t === 'h1') h1++;
    const atributos = {};
    for (const a of attrs.matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) atributos[a[1].toLowerCase()] = a[2];
    const resto = attrs.replace(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g, '').trim();
    if (resto) err(cap, `línea ${ln}: atributo mal escrito en <${t}> («${resto}»). Use comillas dobles.`);
    for (const a of Object.keys(atributos)) {
      const permitidos = [...(ATRIBUTOS['*'] || []), ...(ATRIBUTOS[t] || [])];
      if (!permitidos.includes(a)) err(cap, `línea ${ln}: atributo «${a}» no permitido en <${t}>.`);
    }
    if (atributos.class !== undefined) {
      for (const c of atributos.class.split(/\s+/).filter(Boolean)) {
        if (!CLASES.has(c)) err(cap, `línea ${ln}: clase no permitida «${c}».`);
        else if (!(CLASES_POR_ETIQUETA[t] || []).includes(c)) err(cap, `línea ${ln}: la clase «${c}» no va en <${t}>.`);
      }
    }
    if (atributos.id) ids.push({ id: atributos.id, ln });
    if (t === 'a') {
      const h = atributos.href;
      if (h === undefined) err(cap, `línea ${ln}: enlace sin href.`);
      else if (!h.startsWith('#')) err(cap, `línea ${ln}: enlace no interno («${h}»). El manual abre sin conexión.`);
      else hrefs.push({ href: h.slice(1), ln });
    }
    if (t === 'figure' && (atributos.class || '').includes('captura')) {
      if (!/^c\d\d-\d\d$/.test(atributos['data-captura'] || '')) err(cap, `línea ${ln}: data-captura debe ser «cNN-NN».`);
      else capturas.push(atributos['data-captura']);
    }
  }
  if (pila.length) err(cap, `etiquetas sin cerrar al final del archivo: ${pila.join(', ')}.`);

  const num = codigo.slice(1);
  const lo = codigo.toLowerCase();
  const raiz = sinEtiquetas.match(/^\s*<section\b[^>]*>/);
  if (!raiz || !/class="capitulo"/.test(raiz[0])) err(cap, 'El archivo debe empezar con <section class="capitulo" ...>.');
  else {
    if (!new RegExp(`id="${lo}"`).test(raiz[0])) err(cap, `La sección raíz debe tener id="${lo}".`);
    if (!new RegExp(`data-codigo="${codigo}"`).test(raiz[0])) err(cap, `La sección raíz debe tener data-codigo="${codigo}".`);
    if (!/data-titulo="[^"]+"/.test(raiz[0])) err(cap, 'La sección raíz debe tener data-titulo.');
  }
  if (h1 !== 1) err(cap, `Debe haber un solo <h1>; hay ${h1}.`);
  if (!/<p class="resumen">/.test(sinEtiquetas)) err(cap, 'Falta <p class="resumen"> con el resumen del capítulo.');

  for (const { id, ln } of ids) {
    if (id !== lo && !id.startsWith(lo + '-')) err(cap, `línea ${ln}: el id «${id}» debe empezar con «${lo}-».`);
    if (!/^[a-z0-9-]+$/.test(id)) err(cap, `línea ${ln}: el id «${id}» solo admite minúsculas sin tildes, números y guiones.`);
  }
  for (const c of capturas.filter((x, i) => !x.startsWith(lo + '-'))) err(cap, `La captura «${c}» no es de este capítulo.`);
  capturas.forEach((c, i) => { if (capturas.indexOf(c) !== i) err(cap, `Captura repetida: ${c}.`); });

  /* Tareas: siete apartados, en orden. */
  let nTareas = 0;
  for (const t of sinEtiquetas.matchAll(/<section class="tarea"[^>]*>/g)) {
    nTareas++;
    const ini = t.index;
    const sig = sinEtiquetas.indexOf('<section class="tarea"', ini + 10);
    const cuerpo = sinEtiquetas.slice(ini, sig === -1 ? sinEtiquetas.length : sig);
    const id = (t[0].match(/id="([^"]+)"/) || [])[1] || `(línea ${linea(sinEtiquetas, ini)})`;
    const h3 = [...cuerpo.matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map(x => textoPlano(x[1]));
    let pos = -1;
    for (const a of APARTADOS) {
      const i = h3.findIndex((x, k) => k > pos && x.startsWith(a));
      if (i === -1) { err(cap, `Tarea «${id}»: falta el apartado «${a}» o está fuera de orden.`); } else pos = i;
    }
    if (!/<h2>/.test(cuerpo)) err(cap, `Tarea «${id}»: falta <h2> con su título.`);
  }
  if (!/class="a-simple-vista"/.test(sinEtiquetas) && nTareas > 0) avi(cap, 'No tiene la sección «A simple vista».');

  /* Texto: credenciales, emojis, jerga, glosario. */
  const sinMarcas = sinEtiquetas
    .replace(/<span class="(?:boton|campo|ruta|valor)">[\s\S]*?<\/span>/g, ' ')
    .replace(/<figcaption>[\s\S]*?<\/figcaption>/g, ' ');
  const plano = textoPlano(sinMarcas);
  const bajo = plano.toLowerCase();
  if (/\p{Extended_Pictographic}/u.test(textoPlano(sinEtiquetas).replace(/[←-⇿•·›]/g, ''))) err(cap, 'Contiene emojis.');
  if (/(contraseña|password|clave)\s*[:=]\s*\S+/i.test(plano) || /(server|data source)=[^;]+;/i.test(plano)) err(cap, 'Parece contener una credencial o cadena de conexión.');
  for (const j of JERGA) if (bajo.includes(j)) avi(cap, `Jerga técnica: «${j.trim()}».`);
  for (const g of glosario) {
    const r = new RegExp(`(^|[^\\p{L}])${g.variante.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'iu');
    const hit = r.exec(plano);
    if (hit) {
      const ctx = plano.slice(Math.max(0, hit.index - 25), hit.index + g.variante.length + 30);
      (ARGS.has('--estricto') ? err : avi)(cap, `Término fuera del glosario: «${g.variante}» (use «${g.termino}»): …${ctx}…`);
    }
  }
  if (/\s[!¡]|!\s/.test(plano.replace(/!\)/g, ''))) avi(cap, 'Usa signos de exclamación.');
  return { ids: ids.map(x => x.id), hrefs, capturas, nTareas };
}

/* ---------------------------------------------------------------- Transformaciones */
function transformar(html, existentes) {
  let s = html.replace(/<!--[\s\S]*?-->/g, '');
  /* Un enlace a un capítulo que todavía no existe no debe parecer un enlace que falla. */
  s = s.replace(/<a href="#([a-z0-9-]+)">([\s\S]*?)<\/a>/g, (m, id, texto) =>
    existentes.has(id) ? m : `<span class="enlace-pendiente" title="Este capítulo todavía no está escrito">${texto}</span>`);
  s = s.replace(/<aside class="(aviso|nota|consejo)">/g, (_, c) =>
    `<aside class="${c}" role="note" aria-label="${TITULOS_CALLOUT[c]}"><p class="callout-tit">${TITULOS_CALLOUT[c]}</p>`);
  /* En celular las tablas se apilan; cada celda necesita el nombre de su columna. */
  s = s.replace(/<table>[\s\S]*?<\/table>/g, t => {
    const cab = [...(t.match(/<thead>[\s\S]*?<\/thead>/) || [''])[0].matchAll(/<th>([\s\S]*?)<\/th>/g)].map(x => textoPlano(x[1]));
    if (!cab.length) return t;
    return t.replace(/<tbody>[\s\S]*?<\/tbody>/, cuerpo => cuerpo.replace(/<tr>([\s\S]*?)<\/tr>/g, (_, fila) => {
      let i = 0;
      return '<tr>' + fila.replace(/<td>/g, () => `<td data-label="${escapar(cab[i++] || '')}">`) + '</tr>';
    }));
  });
  s = s.replace(/<table>[\s\S]*?<\/table>/g, t =>`<div class="tabla-scroll" tabindex="0" role="region" aria-label="Tabla desplazable">${t}</div>`);
  return s;
}

/* ---------------------------------------------------------------- Vistas más nuevas que su capítulo (MN9.2)
   Para cada capítulo toma de inventario.md los controladores de su sección y compara la fecha del último
   commit que tocó esos controladores o sus vistas con la fecha del archivo del capítulo. Solo ve lo que ya
   está en la rama de esta carpeta: los cambios sin fusionar de otra rama no aparecen hasta que se fusionen. */
function vistasMasNuevas(capitulos) {
  const rutaInv = path.join(AQUI, 'inventario.md');
  if (!fs.existsSync(rutaInv)) return;
  const raiz = path.resolve(AQUI, '..', '..');
  const git = args => require('child_process').execFileSync('git', ['-c', 'safe.directory=*', '-C', raiz, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  try { git(['rev-parse', '--git-dir']); } catch (e) { avi('vistas', 'No se pudo consultar git: se omite la comparación de fechas de vistas.'); return; }
  const inv = leer(rutaInv).texto;
  for (const c of capitulos) {
    const ini = inv.indexOf(`### ${c.codigo} `);
    if (ini === -1) continue;
    const fin = inv.indexOf('\n### ', ini + 5);
    const seccion = inv.slice(ini, fin === -1 ? inv.length : fin);
    const rutas = new Set();
    for (const fila of seccion.split('\n').filter(f => f.startsWith('|'))) {
      const celdaRuta = (fila.split('|')[2] || '');
      for (const m of celdaRuta.matchAll(/(Admin\/)?([A-Z][A-Za-z0-9]+)(?:\/|:)/g)) {
        const [, admin, nombre] = m;
        const base = admin ? 'Areas/Admin/' : '';
        for (const r of [`${base}Controllers/${nombre}Controller.cs`, `${base}Views/${nombre}`]) if (fs.existsSync(path.join(raiz, r))) rutas.add(r);
      }
    }
    if (!rutas.size) continue;
    const escrito = fs.statSync(path.join(DIR_CAP, c.archivo)).mtimeMs / 1000;
    let salida = '';
    try { salida = git(['log', '--since=' + Math.floor(escrito), '--format=%cs %h', '--name-only', '--', ...rutas]); } catch (e) { continue; }
    const archivos = [...new Set(salida.split('\n').filter(l => /\.(cshtml|cs)$/.test(l)))];
    if (archivos.length) avi(c.codigo, `Vistas o controladores con commits posteriores al capítulo (${archivos.length}): ${archivos.slice(0, 6).join(', ')}${archivos.length > 6 ? '…' : ''}. Revise el capítulo.`);
  }
}

/* ---------------------------------------------------------------- Lista de capturas (MN8.1) */
function escribirCapturas(capitulos) {
  const filas = [];
  for (const c of capitulos) {
    for (const m of c.texto.matchAll(/<figure class="captura" data-captura="([^"]+)">\s*<figcaption>([\s\S]*?)<\/figcaption>/g)) {
      const antes = c.texto.slice(0, m.index);
      const tarea = [...antes.matchAll(/<section class="(?:tarea|tema)" id="[^"]+"[^>]*>\s*<h2>([\s\S]*?)<\/h2>/g)].pop();
      filas.push(`| [ ] | ${m[1]} | ${c.codigo} ${c.titulo} | ${tarea ? textoPlano(tarea[1]) : ''} | ${textoPlano(m[2]).replace(/\|/g, '/')} |`);
    }
  }
  const texto = `# Capturas pendientes del manual

Generado por \`armar.cjs\`; no se edita a mano (se vuelve a escribir en cada armado). Total: ${filas.length}.

Para cada captura: datos de demostración, nunca datos reales; sin contraseñas a la vista; ancho de escritorio salvo que la descripción diga celular. El archivo se guarda como \`capturas/<código>.png\` (por ejemplo \`capturas/c09-01.png\`).

| Hecha | Código | Capítulo | Tarea o tema | Qué debe verse |
|---|---|---|---|---|
${filas.join('\n')}
`;
  fs.writeFileSync(path.join(AQUI, 'capturas.md'), texto, 'utf8');
  return filas.length;
}

/* ---------------------------------------------------------------- Principal */
function principal() {
  const plantilla = path.join(AQUI, 'plantilla.html');
  if (!fs.existsSync(plantilla)) { console.error('Falta plantilla.html'); process.exit(1); }
  const glosario = cargarGlosario();

  const archivos = fs.existsSync(DIR_CAP) ? fs.readdirSync(DIR_CAP).filter(f => /\.html$/.test(f)).sort() : [];
  const capitulos = [];
  for (const f of archivos) {
    const m = f.match(/^c(\d\d)-[a-z0-9-]+\.html$/);
    if (!m) { err('capitulos', `El archivo «${f}» no sigue el nombre cNN-palabras.html.`); continue; }
    const codigo = 'C' + m[1];
    if (!PLAN.some(p => p[0] === codigo)) { err('capitulos', `«${f}»: ${codigo} no está en el plan (C01 a C19).`); continue; }
    if (capitulos.some(c => c.codigo === codigo)) { err('capitulos', `Hay dos archivos para ${codigo}.`); continue; }
    const { texto, bom } = leer(path.join(DIR_CAP, f));
    if (bom) err(codigo, 'El archivo tiene BOM; guárdelo como UTF-8 sin BOM.');
    if (texto.includes('�')) err(codigo, 'Contiene el carácter de reemplazo U+FFFD (codificación dañada).');
    const info = revisar(codigo, f, texto, glosario);
    const titulo = ((texto.match(/data-titulo="([^"]+)"/) || [])[1]) || PLAN.find(p => p[0] === codigo)[1];
    capitulos.push({ codigo, archivo: f, texto, titulo, ...info });
  }
  capitulos.sort((a, b) => a.codigo.localeCompare(b.codigo));

  /* Ids únicos y enlaces entre capítulos. */
  const todos = new Map();
  for (const c of capitulos) for (const id of c.ids) {
    if (todos.has(id)) err(c.codigo, `El id «${id}» ya existe en ${todos.get(id)}.`); else todos.set(id, c.codigo);
  }
  const planIds = new Set(PLAN.map(p => p[0].toLowerCase()));
  const pendientes = [];
  for (const c of capitulos) for (const h of c.hrefs) {
    if (todos.has(h.href)) continue;
    if (planIds.has(h.href)) { pendientes.push(`${c.codigo} enlaza a #${h.href}, capítulo que todavía no existe.`); continue; }
    const capDestino = h.href.split('-')[0];
    if (planIds.has(capDestino) && !capitulos.some(x => x.codigo.toLowerCase() === capDestino)) { pendientes.push(`${c.codigo} enlaza a #${h.href}, en un capítulo que todavía no existe.`); continue; }
    err(c.codigo, `línea ${h.ln}: el enlace #${h.href} no apunta a ningún id.`);
  }
  for (const p of [...new Set(pendientes)]) avi('enlaces', p);

  vistasMasNuevas(capitulos);

  /* Informe. */
  const faltan = PLAN.filter(p => !capitulos.some(c => c.codigo === p[0]));
  const total = capitulos.reduce((n, c) => n + c.capturas.length, 0);
  console.log(`Capítulos encontrados: ${capitulos.length} de ${PLAN.length} (${capitulos.map(c => c.codigo).join(', ') || 'ninguno'})`);
  if (faltan.length) console.log(`Faltan: ${faltan.map(p => p[0]).join(', ')}`);
  console.log(`Tareas: ${capitulos.reduce((n, c) => n + c.nTareas, 0)}. Capturas pendientes: ${total}.`);
  if (avisos.length) { console.log(`\nAvisos (${avisos.length}):`); for (const a of avisos) console.log(`  [${a.cap}] ${a.msg}`); }
  if (errores.length) {
    console.log(`\nERRORES (${errores.length}):`);
    for (const e of errores) console.log(`  [${e.cap}] ${e.msg}`);
    if (!ARGS.has('--forzar')) { console.log('\nNo se armó el manual. Corrija los errores (o use --forzar para ver cómo va).'); process.exit(1); }
    console.log('\n--forzar: se arma el manual con errores.');
  }
  if (ARGS.has('--solo-revisar')) { console.log('\nRevisión terminada, sin escribir el manual.'); return; }
  console.log(`Lista de capturas: capturas.md (${escribirCapturas(capitulos)}).`);

  /* Índice. */
  const numero = c => String(parseInt(c.slice(1), 10));
  let indice = '<ol>\n';
  for (const [cod, tit] of PLAN) {
    const c = capitulos.find(x => x.codigo === cod);
    if (!c) { if (!ARGS.has('--sin-pendientes')) indice += `<li class="falta"><span><span class="num">${numero(cod)}</span> ${escapar(tit)}</span><em>Pendiente</em></li>\n`; continue; }
    const tareas = [...c.texto.matchAll(/<section class="(?:tarea|tema)" id="([^"]+)"[^>]*>\s*<h2>([\s\S]*?)<\/h2>/g)].map(x => [x[1], textoPlano(x[2])]);
    indice += `<li class="cap"><a href="#${cod.toLowerCase()}"><span class="num">${numero(cod)}</span><span>${escapar(c.titulo)}</span></a>`;
    if (tareas.length) indice += '\n<ol class="tareas">' + tareas.map(([id, t]) => `<li><a href="#${id}">${escapar(t)}</a></li>`).join('') + '</ol>\n';
    indice += '</li>\n';
  }
  indice += '</ol>';

  const inv = fs.existsSync(path.join(AQUI, 'inventario.md')) ? leer(path.join(AQUI, 'inventario.md')).texto : '';
  const commit = (inv.match(/Commit de partida: `([0-9a-f]{7,40})`/) || [])[1] || 'sin indicar';
  const fecha = new Date().toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });

  let salida = leer(plantilla).texto;
  const cuerpo = capitulos.map(c => transformar(c.texto.trim(), todos)).join('\n\n') || '<div class="vacio">Todavía no hay capítulos escritos.</div>';
  const valores = {
    '{{INDICE}}': indice,
    '{{CAPITULOS}}': cuerpo,
    '{{CAPITULOS_INCLUIDOS}}': `${capitulos.length} de ${PLAN.length}`,
    '{{FECHA}}': fecha,
    '{{COMMIT}}': commit.slice(0, 10)
  };
  for (const [k, v] of Object.entries(valores)) salida = salida.split(k).join(v);
  const resto = salida.match(/\{\{[A-Z_]+\}\}/g);
  if (resto) { console.error('Quedaron marcas sin reemplazar en la plantilla: ' + [...new Set(resto)].join(', ')); process.exit(1); }
  if (/<(?:script|link|img)[^>]+(?:src|href)="https?:/i.test(salida)) { console.error('La plantilla referencia recursos externos; el manual debe abrir sin conexión.'); process.exit(1); }

  const destino = path.join(AQUI, 'manual-pdi.html');
  fs.writeFileSync(destino, salida, 'utf8');
  console.log(`\nListo: ${path.relative(process.cwd(), destino)} (${(Buffer.byteLength(salida) / 1024).toFixed(0)} KB)`);
}
principal();
