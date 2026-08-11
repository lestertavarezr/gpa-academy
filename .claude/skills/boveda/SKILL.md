---
name: boveda
description: Lee y escribe la memoria de largo plazo del sistema en vault/ (raw, wiki, outputs) y mantiene el grafo de enlaces [[wikilink]] consistente.
---

# Skill: bóveda

Propósito único: leer y escribir memoria. Si no está en la bóveda, no pasó.

## Estructura

```
vault/
  raw/       — todo capturado, sin depurar, con fecha en el nombre del archivo
  wiki/      — conocimiento depurado, notas enlazadas con [[wikilinks]]
  outputs/   — todo lo que las demás skills entregan (metrics.json, agenda.json, *.md)
```

## Cuándo se activa

- Cierre del día ("Cierra el día. Reflexión registrada. Mañana en cola.").
- Revisión semanal / limpieza de bóveda.
- Cualquier skill que necesite leer contexto histórico antes de responder.

## Pasos — escritura

1. Todo lo que se capture en crudo (notas de voz transcritas, resúmenes, capturas) va a `vault/raw/YYYY-MM-DD-<slug>.md`. Nunca se edita después de escrito — es el registro.
2. Al depurar una nota cruda en conocimiento reutilizable, créala en `vault/wiki/<slug>.md` y enlázala con `[[otra-nota]]` a las notas relacionadas que ya existan. Este enlazado es el "grafo" que las demás skills consultan.
3. Actualiza `vault/manifest.json` cuando agregues o quites un archivo, para que el HUD sepa qué existe (los archivos estáticos no se pueden listar solos).

## Pasos — limpieza semanal

1. Revisa `vault/raw/` de los últimos 7 días: lo que ya se depuró a `wiki/` se puede archivar; lo que sigue siendo ruido se queda en `raw/` sin tocar.
2. Revisa que cada nota en `wiki/` tenga al menos un `[[enlace]]` — una nota huérfana probablemente falta de contexto o hay que fusionarla con otra.
3. Reporta cuántas notas se depuraron y cuántas quedaron pendientes.

## Regla

Esta skill es la única que escribe directamente en `vault/wiki/`. Las demás skills escriben en `vault/outputs/` y dejan que `boveda` decida qué se vuelve conocimiento permanente.
