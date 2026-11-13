# Guía de redacción del manual de PDI

Obligatoria para todo agente que escriba un capítulo. El capítulo modelo es `capitulos/c09-matricula.html`: ante la duda, imítelo. Esta guía fija el contenido; el aspecto lo da `plantilla.html` (MN3) y no se toca desde un capítulo.

## 1. Lector y tono

- El primer lector es la persona dueña del sistema: conoce la institución, no el código ni la programación. Después lo leerán administradores y docentes.
- Escriba de "usted", en español claro y frases cortas. Un paso, una acción.
- Sin jerga técnica: no diga "controlador", "endpoint", "tenant", "claim", "ViewModel", "base de datos" ni nombres de clases. Si hace falta mencionar algo técnico, dígalo con palabras de oficina ("el sistema guarda", "queda registrado").
- Sin emojis. Sin signos de exclamación. Sin frases de relleno ("como podrá ver", "es importante recordar").
- UTF-8 sin BOM. Tildes y eñes completas. Fechas como el sistema las muestra (`dd/MM/yyyy`).
- Use solo los términos del `glosario.md`. Si necesita un término nuevo, agréguelo al final de `PENDIENTE_CONFIRMAR.md` con la forma que propone.

## 2. Reglas de contenido

1. El código manda sobre la documentación de `DOCS/`. Los nombres de botones, campos, pestañas, menús y mensajes se copian de la vista tal como se ven en pantalla (con sus tildes y mayúsculas).
2. Nada inventado. Lo que no pueda confirmar en el código no se escribe: va a `PENDIENTE_CONFIRMAR.md` con el archivo donde surgió la duda.
3. Ninguna credencial: ni contraseñas, ni usuarios de prueba, ni cadenas de conexión, ni claves de correo.
4. No describa pantallas de prueba, diagnóstico ni las que `inventario.md` marca como "no entran al manual".
5. Los permisos se nombran con el texto del inventario en el capítulo solo cuando ayuda a decidir quién puede hacer algo; el lector común piensa en roles. Diga "Quien tenga el permiso de matrícula (matricula.crear)" una sola vez al inicio de la tarea y use el rol después. Mientras no se confirme la matriz real de roles (`PENDIENTE_CONFIRMAR.md`, punto 1), no afirme qué rol tiene qué permiso: escriba "quien tenga el permiso X; el rol Administrador lo recibe en la instalación estándar" solo si el inventario lo respalda.
6. Si la pantalla solo pide haber iniciado sesión, dígalo así: "Cualquier usuario con sesión iniciada entra; el menú solo la muestra a [roles]".
7. Los datos de ejemplo son inventados y neutros: "Estudiante Ejemplo Uno", "Colegio de Ejemplo", cédulas `1-2345-6789`. Nunca datos reales.

## 3. Estructura de un capítulo

Un capítulo es un fragmento HTML (sin `<html>`, `<head>` ni `<body>`) con esta forma:

```html
<section class="capitulo" id="c09" data-codigo="C09" data-titulo="Matrícula">
  <h1>Matrícula</h1>
  <p class="resumen">Una o dos frases: qué se hace en este capítulo.</p>

  <section class="a-simple-vista">
    <h2>A simple vista</h2>
    <!-- tabla: tarea, quién la hace, dónde está -->
  </section>

  <section class="conceptos">
    <h2>Antes de empezar</h2>
    <!-- lo mínimo que hay que entender: términos, requisitos previos -->
  </section>

  <section class="tarea" id="c09-matricular">
    <h2>Matricular a un estudiante</h2>
    <h3>Para qué sirve</h3>
    <h3>Quién puede hacerla</h3>
    <h3>Dónde está</h3>
    <h3>Pasos</h3>
    <h3>Qué pasa después</h3>
    <h3>Errores frecuentes</h3>
    <h3>Tareas relacionadas</h3>
  </section>

  <!-- más tareas -->
</section>
```

Reglas de la estructura:

- Un capítulo, un `<h1>`. Las tareas son `<h2>`; los siete apartados fijos son `<h3>`, en ese orden y con ese texto. Si un apartado no aplica, déjelo con una frase ("No hay errores frecuentes conocidos") en lugar de quitarlo. Dentro de un apartado puede usar `<h4>` para subdividir.
- Los `id` siguen el patrón: capítulo en minúscula (`c09`), y para cada tarea `c09-` más palabras separadas por guion, sin tildes ni eñes (`c09-cambiar-seccion`). Son únicos en todo el manual.
- La sección "A simple vista" va primero y es una tabla de tres columnas: Tarea (con enlace a la tarea), Quién, Dónde.
- Los capítulos sin tareas (C01, C17, C18, C19) usan `<section class="tema">` con `<h2>` y párrafos, sin los siete apartados.

### Contenido de cada apartado

1. **Para qué sirve:** una o dos frases, desde el punto de vista de la persona ("Para dejar a un estudiante inscrito en un nivel y una sección").
2. **Quién puede hacerla:** permiso exigido y quién lo suele tener (regla 5 y 6 de la sección 2).
3. **Dónde está:** la ruta del menú con `<span class="ruta">`: `Configuración › Estudiantes › Matrícula`. Si hay más de un camino, dé el más corto.
4. **Pasos:** lista numerada `<ol>`. Cada paso empieza con un verbo y nombra el control exacto: "Pulse <span class="boton">Matricular</span>", "En el campo <span class="campo">Nivel</span> elija el nivel". Un solo paso por elemento de la lista. Si un paso cambia según la institución (anual o por período), sepárelo con `<p class="variante">`.
5. **Qué pasa después:** el efecto visible (mensaje, nuevo estado, quién recibe qué). Cite el mensaje del sistema entre comillas latinas «así» solo si lo copió del código.
6. **Errores frecuentes:** lista `<ul>` de pares "Síntoma: causa y qué hacer", un elemento por error. Parta de los mensajes y bloqueos que el código realmente produce.
7. **Tareas relacionadas:** lista de enlaces a otras tareas del mismo capítulo o de otros.

## 4. Etiquetas y clases permitidas

Solo estas. `armar.cjs` rechaza lo demás (MN3.3).

| Uso | Etiqueta o clase |
|---|---|
| Estructura | `section`, `h1` a `h4`, `p`, `ul`, `ol`, `li` |
| Énfasis | `strong` (nombres que importan), `em` (sentido, poco uso) |
| Tablas | `table`, `caption`, `thead`, `tbody`, `tr`, `th`, `td` |
| Definiciones | `dl`, `dt`, `dd` |
| Enlaces | `a` con `href="#id"` (solo internos) |
| Nombre de un botón | `<span class="boton">Matricular</span>` |
| Nombre de un campo, lista o casilla | `<span class="campo">Nivel</span>` |
| Ruta de menú | `<span class="ruta">Configuración › Matrícula</span>` |
| Texto que escribe el usuario o que aparece en pantalla | `<span class="valor">7-1</span>` |
| Variante según el tipo de institución | `<p class="variante"><strong>En una institución que matricula una vez al año:</strong> …</p>` |
| Recuadro de aviso (algo que puede salir mal) | `<aside class="aviso">…</aside>` |
| Recuadro de nota (dato útil, no urgente) | `<aside class="nota">…</aside>` |
| Recuadro de consejo | `<aside class="consejo">…</aside>` |
| Captura de pantalla pendiente | `<figure class="captura" data-captura="c09-01"><figcaption>…</figcaption></figure>` |

No use `style`, `script`, `iframe`, `img`, `div`, `br`, `b`, `i`, `font`, ni atributos `style`, `class` distintos de la tabla, `onclick`. Los enlaces externos no se permiten: el manual abre sin conexión.

## 5. Capturas

Cada captura se anuncia con un recuadro, no con una imagen (decisión MN0.3):

```html
<figure class="captura" data-captura="c09-01">
  <figcaption>Pantalla Matrícula con el listado: arriba los filtros Nivel, Sección y Estado; en la tabla, la columna Estado con la etiqueta Formalizada.</figcaption>
</figure>
```

- `data-captura` es `código del capítulo`, guion, número de dos cifras, consecutivo en el capítulo. Sirve para la lista de MN8.1.
- La descripción dice qué debe verse, qué parte resaltar y con qué datos de ejemplo, en una o dos frases. Quien tome la captura debe poder hacerla solo con eso.
- Una captura por pantalla importante o por paso que cambia mucho la pantalla. Entre 3 y 8 por capítulo.

## 6. Enlaces

- A otra tarea: `<a href="#c09-cambiar-seccion">Cambiar de sección</a>`.
- A otro capítulo: `<a href="#c12">capítulo 12, Rúbricas e instrumentos</a>`. Antes de enlazar a una tarea de otro capítulo, confirme que ese capítulo ya existe y que el `id` es el de su `section`; si todavía no existe, enlace al capítulo (`#c12`).
- Al glosario: `<a href="#c19">glosario</a>` solo una vez, en "Antes de empezar" si el capítulo usa términos nuevos para el lector.

## 7. Lo que hace cada pieza

| Pieza | Quién la toca |
|---|---|
| `capitulos/cNN-*.html` | Su único autor |
| `PENDIENTE_CONFIRMAR.md` | Todos, agregando líneas al final |
| `GUIA_REDACCION.md`, `glosario.md`, `inventario.md` | Solo la sesión principal |
| `plantilla.html`, `armar.cjs`, `manual-pdi.html` | Solo la sesión principal |

## 8. Lista de comprobación antes de entregar

- [ ] Un solo archivo escrito, con el nombre del encargo.
- [ ] Un `<h1>`; cada tarea con sus siete apartados en orden.
- [ ] Cada botón, campo y mensaje coincide con la vista (copiado, no recordado).
- [ ] Ninguna etiqueta ni clase fuera de la tabla de la sección 4.
- [ ] Todos los `id` únicos y todos los enlaces internos apuntan a un `id` que existe.
- [ ] Solo términos del glosario; sin jerga técnica; sin emojis.
- [ ] Sin credenciales ni datos reales.
- [ ] Lo dudoso está en `PENDIENTE_CONFIRMAR.md`, no en el capítulo.
- [ ] El archivo es UTF-8 sin BOM.
