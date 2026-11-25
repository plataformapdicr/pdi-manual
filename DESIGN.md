# Design: marco del manual de PDI

Derivado de `plantilla.html` ya construida (MN3). Superficie de lectura. Hereda la identidad de PDI; no crea una propia.

## Mundo visual

- **Herencia.** Azul marino y azul de PDI (`wwwroot/css/home-panel.css`, `periodos-academicos.css`): barra superior marino, enlaces azules, fondos fríos casi blancos. En oscuro, marino profundo.
- **Estrategia de color.** Restringida: neutros fríos más un acento azul. Los recuadros usan tres tintes con función (aviso rojo suave, nota azul, consejo verde); no hay otro color decorativo.
- **Tipografía.** Pila del sistema (`Segoe UI Variable`, `Segoe UI`, `system-ui`). La aplicación usa Inter desde internet; el manual debe abrir sin conexión, así que no se incrusta ni se carga ninguna fuente. Cuerpo 17 px con interlineado 1,65; medida máxima 70ch; títulos en peso 700 a 750 con tracking negativo leve.
- **Forma.** Esquinas de 8 a 12 px, líneas de 1 px, una sola sombra suave solo en elementos flotantes (resultados de búsqueda y menú móvil). Sin tarjetas anidadas, sin bordes laterales de color, sin degradados de texto.

## Tokens (definidos en `:root` de `plantilla.html`)

`--marino #0f2545`, `--marino-2 #17356b`, `--azul #2f5bb8`, `--azul-suave #e8eefb`, `--tinta #1b2a3f`, `--tinta-2 #3a4a62`, `--tinta-3 #566680`, `--linea #dce4ef`, `--enlace #1f4a9e`, `--foco #2859aa`. Tema oscuro y modo impresión redefinen los mismos nombres; los componentes no llevan colores fijos (botón y número de paso usan `--boton-fondo`).

## Piezas

- **Barra superior** fija: marca "PDI", buscador (atajo `/`), tema (Auto, Claro, Oscuro).
- **Índice lateral** fijo: capítulos numerados; el capítulo actual se despliega con sus tareas y la sección en pantalla queda marcada. Los capítulos aún no escritos aparecen con la etiqueta "Pendiente". En pantallas de hasta 62 rem pasa a ser un panel que se abre con el botón de menú.
- **Marcas de texto** (las que fija `GUIA_REDACCION.md`): `boton` (relleno marino, texto blanco), `campo` (fondo azul suave con borde), `ruta` (subrayado grueso), `valor` (fondo neutro con borde).
- **Pasos** numerados con círculo marino; **recuadros** aviso, nota y consejo con icono dibujado (SVG en máscara) y título; **capturas pendientes** como recuadro punteado con icono y descripción; **variante** como bloque tenue.
- **Tablas** dentro de un contenedor desplazable en celular.

## Comportamiento

- Buscador sin dependencias: ignora tildes y mayúsculas, exige todas las palabras, puntúa más el título de la tarea, muestra fragmento resaltado, se maneja con flechas, Enter y Esc.
- Movimiento: una sola entrada suave del encabezado de capítulo; se desactiva con `prefers-reduced-motion`.
- Impresión: oculta barra e índice, fuerza blanco y negro sin importar el tema, un capítulo por página nueva, y el botón "Imprimir este capítulo" imprime solo ese.
- Sin conexión: nada se carga desde internet; `armar.cjs` rechaza recursos externos.

## Comprobado

Contraste calculado en el navegador sobre todo el texto, tema claro y oscuro: sin pares por debajo de 4,5:1 (3:1 en texto grande). Sin desborde horizontal a 375 px. Búsqueda, menú móvil y marcado del índice funcionan. La impresión se generó a PDF (8 páginas con un capítulo) pero no se inspeccionó visualmente.
