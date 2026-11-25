#!/usr/bin/env node
/*
 * tomar-capturas.cjs: asistente para tomar las capturas del manual (MN8.2).
 *
 * Abre Chrome (con ventana), usted inicia sesión, y el asistente va pantalla por pantalla:
 * navega a la dirección de cada captura, le muestra qué debe verse, y usted deja la pantalla
 * como pide la descripción (llenar un campo, abrir un menú, elegir un registro) y pulsa Enter.
 * Guarda DOCS/manual/capturas/<código>.jpg. Luego `node armar.cjs` las incrusta.
 *
 * Uso:   node tomar-capturas.cjs [--base http://localhost:18164] [--solo c09] [--rehacer]
 *   --base      dirección de la aplicación (por defecto http://localhost:18164)
 *   --solo X    solo las capturas cuyo código empiece con X (por ejemplo c09 o c09-02)
 *   --rehacer   vuelve a tomar también las que ya existen
 *
 * En cada captura:  Enter = tomar   s = saltar   q = terminar (lo hecho queda guardado)
 *
 * Antes de empezar: la aplicación corriendo, y una institución de DEMOSTRACIÓN. Las capturas
 * muestran datos reales de la pantalla: use datos de ejemplo, nunca de estudiantes reales.
 * El asistente no escribe contraseñas: el inicio de sesión lo hace usted.
 */
'use strict';
const fs = require('fs'), path = require('path'), readline = require('readline');

const AQUI = __dirname;
const SALIDA = path.join(AQUI, 'capturas');
const args = process.argv.slice(2);
const opc = n => { const i = args.indexOf(n); return i === -1 ? null : (args[i + 1] || true); };
const BASE = (opc('--base') || 'http://localhost:18164').replace(/\/$/, '');
const SOLO = opc('--solo');
const REHACER = args.includes('--rehacer');

/* Dirección de cada captura. '@lista|patrón' = abre la lista y entra al primer enlace que coincida.
   Las que no tienen dirección se dejan para que usted navegue. */
const P = {
  'c01-02': '/', 'c02-02': '/',
  'c03-01': '/Account/ManageUsers', 'c03-02': '/Account/ManageUsers', 'c03-03': '/Admin/Roles/Create', 'c03-04': '/Admin/Permissions/ExportMatrix',
  'c04-01': '/Plataforma', 'c04-03': '/TiposInstitucion', 'c04-02': '@/Instituciones|/Instituciones/Details/',
  'c05-01': '/PeriodosAcademicos', 'c05-02': '/PeriodosAcademicos/Create', 'c05-03': '/Facultades', 'c05-04': '@/Escuelas|/Escuelas/Details/', 'c05-05': '/Materias', 'c05-06': '@/Materias|/Materias/Details/', 'c05-07': '@/Materias|/Materias/Instrumentos/', 'c05-08': '/TiposGrupo',
  'c06-01': '@/Profesores|/Profesores/Details/', 'c06-02': '/Profesores/CreateStep1', 'c06-06': '/ProfesorGuia', 'c06-07': '/MisGrupos', 'c06-08': '/TiposFormacionAcademica',
  'c07-01': '/Estudiantes', 'c07-02': '@/Estudiantes|/Estudiantes/Details/', 'c07-03': '@/Estudiantes|/Estudiantes/Edit/', 'c07-04': '/Estudiantes/ImportarExcel', 'c07-05': '/GruposEstudiantes', 'c07-06': '/GruposEstudiantes/Create', 'c07-07': '@/GruposEstudiantes|/GruposEstudiantes/AsignarEstudiantes/', 'c07-08': '@/GruposEstudiantes|/GruposEstudiantes/Details/', 'c07-09': '/PortalEstudiantil',
  'c08-01': '/Empadronamiento', 'c08-02': '/Empadronamiento/Publico',
  'c09-01': '/Matricula/Configuracion', 'c09-02': '/Matricula/Nueva', 'c09-03': '/Matricula', 'c09-04': '@/Matricula|/Matricula/Detalle/', 'c09-05': '@/Matricula|/Matricula/Detalle/', 'c09-06': '/Matricula/Rematricula',
  'c10-01': '/Horarios', 'c10-02': '/Horarios/Create', 'c10-03': '/Horarios/Create', 'c10-04': '/Horarios', 'c10-05': '/Horarios/HorarioSemanal', 'c10-06': '@/Estudiantes|/Estudiantes/Details/',
  'c11-01': '/AsistenciaLeccion', 'c11-02': '/AsistenciaLeccion/Estadisticas',
  'c12-01': '/Rubricas', 'c12-02': '/Rubricas/Create', 'c12-03': '/ImportarRubrica', 'c12-04': '@/Rubricas|/Rubricas/Compartir/', 'c12-05': '/GruposCalificacion', 'c12-06': '@/Rubricas|/Rubricas/GestionarValoresItems/', 'c12-07': '/InstrumentosEvaluacion', 'c12-08': '/InstrumentoRubrica',
  'c13-01': '@/Evaluaciones|/Evaluaciones/Details/', 'c13-02': '@/Evaluaciones|/Evaluaciones/Details/', 'c13-03': '/Evaluaciones/Create', 'c13-04': '/CuadernoCalificador', 'c13-05': '/CuadernoCalificador', 'c13-06': '/CuadernoCalificador/Tradicional', 'c13-07': '/SEA/Configurar', 'c13-08': '/SEA',
  'c14-01': '/NotaConducta/Dashboard', 'c14-02': '/NotaConducta/EstudiantesRiesgo',
  'c15-01': '/Reportes/ArbolEvaluaciones', 'c15-02': '/Reportes/Dashboard', 'c15-03': '/ReporteCoordinacion', 'c15-04': '/ReportesGestion/Avance', 'c15-05': '/ReportesGestion/Alertas', 'c15-06': '/ReportesGestion/Comparativo', 'c15-07': '/Exportaciones', 'c15-08': '/Exportaciones',
  'c16-01': '/Auditoria', 'c16-02': '/Admin/Audit'
};
/* Estas se toman SIN sesión, en una ventana aparte. */
const SIN_SESION = { 'c01-01': '/', 'c02-01': '/Account/Login' };
/* Aviso extra para las que piden otra cuenta o institución. */
const NOTAS = {
  'c06-07': 'Requiere iniciar sesión con una cuenta de PROFESOR vinculada a un registro de profesor.',
  'c09-06': 'Requiere una institución de matrícula ANUAL con la rematrícula abierta (cámbiela en "Ver sistema como...").',
  'c08-02': 'Si la dirección no abre, use el enlace con el código de su institución (Instituciones › detalle › Empadronamiento público).',
  'c14-01': 'Con una cuenta de profesor esta pantalla falla (defecto MN10.41). Tómela como Super Administrador.',
  'c14-02': 'Abra primero un estudiante en riesgo o aplazado con "Ver"; si no hay ninguno, salte esta.',
  'c02-01': 'Se oculta el recuadro de usuarios de prueba automáticamente.'
};

function cargarLista() {
  const t = fs.readFileSync(path.join(AQUI, 'capturas.md'), 'utf8');
  const filas = [];
  for (const l of t.split('\n')) {
    const m = l.match(/^\| \[[ x]\] \| (c\d\d-\d\d) \| ([^|]*)\| ([^|]*)\| (.*) \|$/);
    if (m) filas.push({ cod: m[1], cap: m[2].trim(), tarea: m[3].trim(), que: m[4].trim() });
  }
  return filas;
}
function cargarPlaywright() {
  const cand = ['playwright-core', 'playwright', path.join(AQUI, '..', '..', '..', '..', '..', 'node_modules', 'playwright-core'), path.join(AQUI, '..', 'node_modules', 'playwright-core'), path.join(AQUI, '..', '..', 'node_modules', 'playwright-core')];
  for (const c of cand) { try { return require(c); } catch (e) { /* siguiente */ } }
  console.error('No se encontró Playwright. Ejecute "npm install" en la carpeta del proyecto y vuelva a intentar.');
  process.exit(1);
}
function pregunta(rl, texto) { return new Promise(r => rl.question(texto, r)); }
const ancho = s => s.replace(/(.{1,96})(\s|$)/g, '$1\n   ').trim();

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  let lista = cargarLista();
  if (!lista.length) { console.error('capturas.md no tiene capturas. Ejecute antes: node armar.cjs'); process.exit(1); }
  if (SOLO) lista = lista.filter(c => c.cod.startsWith(SOLO));
  const existe = c => fs.existsSync(path.join(SALIDA, c + '.jpg'));
  const pendientes = lista.filter(c => REHACER || !existe(c.cod));
  console.log(`Capturas: ${lista.length}; por tomar: ${pendientes.length}.`);
  if (!pendientes.length) { console.log('Nada que hacer. Use --rehacer para repetir.'); return; }

  const pw = cargarPlaywright();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const navegador = await pw.chromium.launch({ channel: 'chrome', headless: false });
  const contexto = await navegador.newContext({ viewport: { width: 1366, height: 860 }, locale: 'es-CR' });
  const pag = await contexto.newPage();
  /* Las fuentes de Google tardan o fallan sin internet y Playwright espera a que carguen: se bloquean (se ve con la fuente del sistema). */
  const sinFuentes = c => c.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await sinFuentes(contexto);
  const guardar = async (p, cod) => {
    try {
      await p.screenshot({ path: path.join(SALIDA, cod + '.jpg'), type: 'jpeg', quality: 78, timeout: 60000 });
      console.log('   guardada: capturas/' + cod + '.jpg');
    } catch (e) {
      console.log('   NO se pudo guardar: ' + String(e.message).split('\n')[0].slice(0, 90));
    }
  };

  // 1) Capturas sin sesión, en un contexto limpio.
  const sinSesion = pendientes.filter(c => SIN_SESION[c.cod]);
  if (sinSesion.length) {
    const ctx2 = await navegador.newContext({ viewport: { width: 1366, height: 860 }, locale: 'es-CR' });
    await sinFuentes(ctx2);
    const p2 = await ctx2.newPage();
    for (const c of sinSesion) {
      await p2.goto(BASE + SIN_SESION[c.cod], { waitUntil: 'networkidle' }).catch(() => {});
      await p2.evaluate(() => { for (const e of document.querySelectorAll('*')) if (e.children.length < 8 && /Usuarios de Prueba/.test(e.textContent || '') && e.textContent.length < 300) { (e.closest('.card, .alert, div') || e).remove(); break; } }).catch(() => {});
      console.log(`\n[${c.cod}] ${c.tarea}\n   ${ancho(c.que)}`);
      if (NOTAS[c.cod]) console.log('   Nota: ' + NOTAS[c.cod]);
      const r = (await pregunta(rl, '   Enter = tomar, s = saltar: ')).trim().toLowerCase();
      if (r !== 's') await guardar(p2, c.cod);
    }
    await ctx2.close();
  }

  // 2) Con sesión.
  const conSesion = pendientes.filter(c => !SIN_SESION[c.cod]);
  if (conSesion.length) {
    await pag.goto(BASE + '/Account/Login').catch(() => {});
    console.log('\nInicie sesión en la ventana de Chrome (como Super Administrador) y, en el Panel de control,');
    console.log('elija una institución de DEMOSTRACIÓN en "Ver sistema como...". Cuando termine, vuelva aquí.');
    await pregunta(rl, 'Pulse Enter para empezar: ');
    let hechas = 0;
    for (const c of conSesion) {
      const dir = P[c.cod];
      if (dir) {
        let url = dir;
        if (dir.startsWith('@')) {
          const [lista, patron] = dir.slice(1).split('|');
          await pag.goto(BASE + lista, { waitUntil: 'networkidle' }).catch(() => {});
          url = await pag.evaluate(p => { const a = [...document.querySelectorAll('main a[href]')].find(x => x.getAttribute('href').includes(p)); return a ? a.getAttribute('href') : null; }, patron);
        }
        if (url) await pag.goto(url.startsWith('http') ? url : BASE + url, { waitUntil: 'networkidle' }).catch(() => {});
      }
      console.log(`\n[${c.cod}] ${c.cap} › ${c.tarea}${dir ? '' : '   (sin dirección: navegue usted)'}\n   ${ancho(c.que)}`);
      if (NOTAS[c.cod]) console.log('   Nota: ' + NOTAS[c.cod]);
      const r = (await pregunta(rl, '   Deje la pantalla como pide y pulse Enter (s = saltar, q = terminar): ')).trim().toLowerCase();
      if (r === 'q') break;
      if (r === 's') continue;
      await guardar(pag, c.cod); hechas++;
    }
    console.log(`\nTomadas en esta sesión: ${hechas}.`);
  }
  rl.close();
  await navegador.close();
  console.log('Listo. Ejecute:  node armar.cjs  para incrustarlas en el manual.');
})().catch(e => { console.error(e); process.exit(1); });
