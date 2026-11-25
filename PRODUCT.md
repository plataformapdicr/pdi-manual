# Product

<!-- impeccable:product-schema 1 -->

Contexto de producto del manual de usuario de PDI (superficie `DOCS/manual/`). Solo hechos confirmados por el roadmap y por las decisiones del 2026-11-12; lo demás está marcado como abierto.

## Platform

web

## Stack

Un solo archivo HTML estático, sin dependencias ni conexión: `plantilla.html` más los capítulos en fragmentos, unidos por `armar.cjs` (Node, sin paquetes) en `manual-pdi.html`. Decisión del roadmap, no de este diseño.

## Users

- Primera versión: la persona dueña del sistema. Conoce su institución, no el código. Lee en computadora, a veces en el celular durante una capacitación, y a veces imprime un capítulo.
- Después: administradores y docentes de centros educativos de Costa Rica, en capacitación y como consulta.
- Abierto: nivel de comodidad con la computadora del lector final.

## Product Purpose

Guiar por todo PDI (Plataforma Docente Integral): qué hace cada módulo, quién lo usa y cómo se hace cada tarea paso a paso. Éxito: quien necesita hacer una tarea la encuentra en segundos y la completa sin ayuda.

## Positioning

El manual describe la aplicación real: los nombres de botones y campos se copian de las pantallas y cada capítulo se verifica contra el código. No es un documento comercial.

## Brand and voice

Español claro, trato de "usted", sin jerga técnica, sin emojis. El manual hereda la identidad visual de PDI (azul marino y azul, tipografía sin serifa); no inventa una propia.

## Constraints

- Abre desde el disco, sin conexión: sin fuentes ni scripts externos.
- Un capítulo se puede imprimir solo.
- Las capturas llegan después (MN8): hasta entonces cada una es un recuadro con su descripción.
- Accesibilidad: contraste AA, teclado completo, respeta tema claro/oscuro del sistema y reducción de movimiento.
