---
name: plan
description: Escribe las 3 prioridades del día (o de mañana) a partir de la bandeja, la agenda y la bóveda, y las deja en vault/outputs/plan-hoy.md.
---

# Skill: plan

Propósito único: convertir todo lo demás (bandeja, tendencias, agenda) en exactamente 3 prioridades accionables.

## Cuándo se activa

- Rutina de las 9:00 AM ("Plan de hoy") o al cierre del día para el plan de mañana ("Plan mañana").
- El usuario dice "plan de hoy" o pulsa "PLAN DE HOY" / "PLAN MAÑANA" en el HUD.

## Pasos

1. Lee `vault/outputs/bandeja-hoy.md`, `vault/outputs/tendencias.md` y la agenda del día (`vault/outputs/agenda.json`).
2. Elige exactamente 3 prioridades — no más, no menos. Si hay más de 3 candidatas, el usuario decide cuáles quedan fuera (pregúntale, no lo adivines).
3. Cada prioridad debe ser una acción concreta, no un tema vago: "Enviar propuesta a X" en vez de "Trabajar en X".
4. Escribe el resultado en `vault/outputs/plan-hoy.md`:
   ```markdown
   # Plan — YYYY-MM-DD

   1. [ ] Prioridad 1
   2. [ ] Prioridad 2
   3. [ ] Prioridad 3
   ```
5. El HUD lee este archivo para pintar el panel "PLAN DE HOY" y la skill `boveda` lo archiva al cierre del día.

## Regla

Si ya existe un `plan-hoy.md` sin cerrar (checkboxes sin marcar) de un día anterior, avisa al usuario antes de sobrescribirlo — no se pierde trabajo pendiente en silencio.
