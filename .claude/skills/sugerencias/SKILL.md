---
name: sugerencias
description: Sugiere que publicar en Instagram combinando los posts de mejor desempeno reales (instagram-posts.md) con tendencias investigadas por Claude Code (WebSearch), y lo deja en vault/outputs/sugerencias.md.
---

# Skill: sugerencias

Propósito único: convertir datos reales + tendencias investigadas en 3-5
ideas concretas de contenido — nunca ideas genéricas de relleno.

Instagram no tiene una API pública de "tendencias" como YouTube. Esta skill
no depende de ninguna — usa las herramientas propias de Claude Code
(WebSearch/WebFetch) para investigar qué se está moviendo, y las cruza con
el desempeño real de la cuenta.

## Cuándo se activa

- El usuario dice "sugerencias" o pulsa "SUGERENCIAS" en el HUD.
- Después de correr `instagram` (necesita `instagram-posts.md` fresco) y
  `tendencias` (necesita `tendencias.md` fresco) — si cualquiera de los dos
  no existe o tiene más de 7 días, corre esa skill primero.

## Pasos

1. Lee `vault/outputs/instagram-posts.md` — identifica el patrón de lo que
   ya funciona: ¿qué formato (reel/carrusel/foto), qué tema, qué tipo de
   gancho en el caption tiene el mejor engagement?

2. Investiga tendencias actuales relevantes al nicho de la cuenta (definido
   en `vault/wiki/` — si no hay una nota de nicho/pilares de contenido,
   pregúntale al usuario cuál es su nicho antes de inventar temas al azar).
   Usa WebSearch para buscar cosas como "tendencias reels instagram
   [nicho] [mes actual]" o "audios en tendencia instagram [nicho]".
   Guarda lo que encuentres en `vault/outputs/tendencias.md` (formato ya
   definido por la skill `tendencias`).

3. Cruza ambas fuentes. Cada sugerencia debe decir explícitamente por qué
   se sugiere — o porque un formato similar ya funcionó (dato real), o
   porque hay una tendencia activa relevante al nicho (dato investigado).
   No mezcles las dos razones en una sola sugerencia vaga.

4. Escribe `vault/outputs/sugerencias.md`:
   ```markdown
   # Sugerencias — YYYY-MM-DD

   ## 1. <idea concreta, no un tema vago>
   - Formato: reel / carrusel / foto
   - Por qué: <dato real de instagram-posts.md O tendencia de tendencias.md, citando la fuente>
   - Gancho sugerido para los primeros 3 segundos / primera línea del caption

   ## 2. ...
   ```
   Máximo 5 ideas. Si no hay suficiente señal real para 5, entrega menos —
   no rellenes con ideas sin base.

5. Si es la primera vez que corre, agrega `outputs/sugerencias.md` a
   `vault/manifest.json`.

## Regla

Cada sugerencia debe poder trazarse a un dato concreto en la bóveda (un
post real o una tendencia investigada con fuente). Si no hay dato, no hay
sugerencia — se dice explícitamente "sin suficiente señal todavía" en vez
de inventar.
