'use strict';
/* Capturas automáticas del manual (MN8.2), sin intervención por pantalla.
   1) node capturar-auto.cjs login   abre Chrome; el usuario inicia sesión, elige la institución
      de demostración en "Ver sistema como..." y cierra la ventana: la sesión queda en un archivo temporal.
   2) node capturar-auto.cjs auto [prefijo]   sin ventana, toma todas (o las del prefijo, ej. c09).
   Antes de cada captura, anonimizar-captura.js reemplaza en la página correos, cédulas, teléfonos,
   el nombre del usuario y los nombres de personas. Revise igual cada imagen antes de publicarla.
   Al terminar, borre el archivo de sesión (se indica su ruta). El script no escribe contraseñas. */
const fs = require('fs'), path = require('path'), os = require('os');
const pw = (() => { for (const c of ['playwright-core', path.join(__dirname, '..', 'node_modules', 'playwright-core'), path.join(__dirname, '..', '..', 'node_modules', 'playwright-core'), path.join(__dirname, '..', '..', '..', '..', '..', 'node_modules', 'playwright-core')]) { try { return require(c); } catch (e) {} } throw new Error('No se encontró playwright-core'); })();
const MAN = __dirname;
const SAL = path.join(MAN, 'capturas');
const EST = path.join(os.tmpdir(), 'pdi-manual-sesion.json');
const BASE = 'http://localhost:18164';
const fase = process.argv[2];
/* Nombres extra a ocultar (por ejemplo el del usuario que inicia sesión): uno por línea en ocultar.local.txt, que no se sube al repositorio. */
const rutaOcultar = path.join(__dirname, 'ocultar.local.txt');
const OCULTAR = fs.existsSync(rutaOcultar) ? fs.readFileSync(rutaOcultar, 'utf8').split(/\r?\n/).map(x => x.trim()).filter(Boolean) : [];
const ANON = 'window.__PDI_OCULTAR = ' + JSON.stringify(OCULTAR) + ';\n' + fs.readFileSync(path.join(__dirname, 'anonimizar-captura.js'), 'utf8');
console.log('Archivo de sesión: ' + EST);
const solo = process.argv[3] || '';

// reutiliza el mapa de direcciones del asistente
const src = fs.readFileSync(path.join(MAN, 'tomar-capturas.cjs'), 'utf8');
const P = eval('(' + src.match(/const P = (\{[\s\S]*?\n\});/)[1] + ')');
const SIN = eval('(' + src.match(/const SIN_SESION = (\{[^}]*\});/)[1] + ')');
/* Capturas que necesitan datos que la institución de demostración no tiene: institución con datos
   (el filtro de anonimización cambia su nombre) y, si hace falta, otra dirección. '{id}' = número
   del primer enlace encontrado con '@lista|patrón'. */
const EXTRA = {
  'c05-04': { inst: 1 }, 'c05-06': { inst: 1 }, 'c05-07': { inst: 1 },
  'c06-01': { inst: 1 },
  'c06-03': { inst: 1, dir: '@/Profesores|/Profesores/Details/', ir: '/Profesores/CreateStep6?profesorId={id}' },
  'c06-04': { inst: 1, dir: '@/Profesores|/Profesores/Details/', ir: '/Profesores/CreateStep4?profesorId={id}' },
  'c06-05': { inst: 1, dir: '@/Profesores|/Profesores/Details/', ir: '/Profesores/CreateStep5?profesorId={id}' },
  'c07-07': { inst: 1 }, 'c07-08': { inst: 1 },
  'c09-04': { inst: 65 }, 'c09-05': { inst: 65 },
  'c12-04': { inst: 1 }, 'c12-06': { inst: 1 },
  'c13-01': { inst: 1, dir: '/Evaluaciones' }, 'c13-02': { inst: 1 }
};
const lista = [];
for (const l of fs.readFileSync(path.join(MAN, 'capturas.md'), 'utf8').split('\n')) {
  const m = l.match(/^\| \[[ x]\] \| (c\d\d-\d\d) \|/); if (m) lista.push(m[1]);
}
const ocultarPrueba = () => { for (const e of document.querySelectorAll('*')) if (e.children.length < 8 && /Usuarios de Prueba/.test(e.textContent || '') && e.textContent.length < 300) { (e.closest('.card, .alert, div') || e).remove(); break; } };

(async () => {
  const nav = await pw.chromium.launch({ channel: 'chrome', headless: fase !== 'login' });
  const bloq = c => c.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  if (fase === 'login') {
    const ctx = await nav.newContext({ viewport: { width: 1366, height: 860 }, locale: 'es-CR' });
    await bloq(ctx);
    const p = await ctx.newPage();
    await p.goto(BASE + '/Account/Login');
    const guardar = async () => { try { await ctx.storageState({ path: EST }); } catch (e) {} };
    const t = setInterval(guardar, 3000);
    await new Promise(r => p.on('close', r));
    clearInterval(t);
    console.log('sesion guardada');
    await nav.close().catch(() => {});
    return;
  }
  fs.mkdirSync(SAL, { recursive: true });
  const ctxS = await nav.newContext({ viewport: { width: 1366, height: 860 }, locale: 'es-CR' }); await bloq(ctxS);
  const ctx = await nav.newContext({ viewport: { width: 1366, height: 860 }, locale: 'es-CR', storageState: EST }); await bloq(ctx);
  const pS = await ctxS.newPage(), p = await ctx.newPage();
  const res = [];
  const soloExtra = process.argv.includes('--extra');
  let instActual = null;
  const elegirInst = async id => {
    if (instActual === id) return;
    await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await p.evaluate(v => { const i = document.querySelector(`li[data-institucion-nombre] input[name=id][value="${v}"]`); if (i) i.form.submit(); }, String(id));
    await p.waitForLoadState('networkidle').catch(() => {}); await p.waitForTimeout(500);
    instActual = id;
  };
  /* --inst N: institución para las capturas normales (por defecto 27, Colegio Piloto Ficticio). */
  const iInst = process.argv.indexOf('--inst');
  if (!soloExtra) await elegirInst(iInst > -1 ? +process.argv[iInst + 1] : 27);
  for (const cod of lista.filter(c => c.startsWith(solo)).filter(c => !soloExtra || EXTRA[c]).filter(c => soloExtra || !EXTRA[c])) {
    try {
      let pg = p, url = null;
      const ex = soloExtra ? EXTRA[cod] : null;
      if (ex) await elegirInst(ex.inst);
      if (SIN[cod]) { pg = pS; url = SIN[cod]; }
      else {
        const dir = (ex && ex.dir) || P[cod]; if (!dir) { res.push(cod + ' SIN-DIR'); continue; }
        url = dir;
        if (dir.startsWith('@')) {
          const [l, pat] = dir.slice(1).split('|');
          await p.goto(BASE + l, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
          url = await p.evaluate(pt => { const a = [...document.querySelectorAll('a[href]')].find(x => x.getAttribute('href').includes(pt)); return a ? a.getAttribute('href') : null; }, pat);
          if (!url) { res.push(cod + ' SIN-ENLACE ' + l); continue; }
          if (ex && ex.ir) url = ex.ir.replace('{id}', (url.match(/(\d+)(?!.*\d)/) || [])[1]);
        }
      }
      const r = await pg.goto(url.startsWith('http') ? url : BASE + url, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => null);
      if (SIN[cod]) await pg.evaluate(ocultarPrueba).catch(() => {});
      await pg.waitForTimeout(400);
      await pg.evaluate(ANON).catch(e => res.push(cod + ' ANON-FALLO ' + e.message.slice(0, 60)));
      await pg.waitForTimeout(150);
      await pg.screenshot({ path: path.join(SAL, cod + '.jpg'), type: 'jpeg', quality: 78, timeout: 60000 });
      const fin = pg.url().replace(BASE, '');
      res.push(cod + ' ' + (r ? r.status() : '???') + ' ' + fin + (/Login|AccessDenied|Error/i.test(fin) ? '  <-- REVISAR' : ''));
    } catch (e) { res.push(cod + ' ERROR ' + String(e.message).split('\n')[0].slice(0, 80)); }
  }
  console.log(res.join('\n'));
  await ctx.storageState({ path: EST }).catch(() => {});
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
