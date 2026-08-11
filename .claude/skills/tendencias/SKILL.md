---
name: tendencias
description: Investiga que se esta moviendo en Instagram/Reels relevante al nicho del usuario (via WebSearch, Instagram no tiene API publica de tendencias) y deja un reporte corto en vault/outputs/tendencias.md.
---

# Skill: tendencias

Propósito único: investigar lo que se mueve afuera y dejar solo las señales
relevantes al nicho de la cuenta — sin inventar, sin rellenar.

Instagram no expone una API pública de tendencias (a diferencia de YouTube).
Esta skill usa las herramientas propias de Claude Code (WebSearch/WebFetch)
para investigar en fuentes públicas, no una API dedicada.

## Cuándo se activa

- El usuario dice "escaneo tendencias" o pulsa "ESCANEO TENDENCIAS" en el HUD.
- Como paso previo a la skill `sugerencias`.

## Pasos

1. Revisa `vault/wiki/` para identificar el nicho/pilares de contenido de la
   cuenta. Si no existe esa nota todavía, pregúntale al usuario cuál es su
   nicho antes de investigar — no adivines un nicho genérico.

2. Usa WebSearch para buscar señales actuales y específicas, por ejemplo:
   - "tendencias reels instagram [nicho] [mes y año actual]"
   - "audios en tendencia instagram [nicho]"
   - "formatos de contenido que están funcionando en instagram [nicho] 2026"

3. Descarta ruido: solo conserva señales con relación directa al nicho.
   Ignora resultados genéricos de "tips de marketing" sin sustancia.

4. Para cada señal relevante, escribe una línea con su fuente:
   `- [tema] descripción — por qué le sirve a esta cuenta (1 frase) — fuente/enlace`

5. Guarda el reporte en `vault/outputs/tendencias.md`, con fecha en el
   encabezado. Máximo 7 señales — si no encuentras 7 con sustancia real,
   entrega menos.

6. Si una señal se repite en 3 investigaciones seguidas (distintas semanas),
   promuévela a una nota en `vault/wiki/` — deja de ser ruido pasajero y
   pasa a ser conocimiento del nicho.

## Regla

Esta skill investiga y reporta con fuente citable. No ejecuta acciones ni
decide qué publicar — de la decisión se encarga `sugerencias`, cruzando
esto con el desempeño real de `instagram-posts.md`.
