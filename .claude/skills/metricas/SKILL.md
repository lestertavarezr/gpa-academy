---
name: metricas
description: Extrae los números clave del día (suscriptores, vistas, consultas, tareas resueltas) y los escribe en vault/outputs/metrics.json para que el HUD y las demás skills los consuman.
---

# Skill: métricas

Propósito único: extraer tus números y dejarlos en un solo archivo que el resto del sistema pueda leer.

## Cuándo se activa

- El usuario dice "extraer métricas" o pulsa el botón "EXTRAER MÉTRICAS" del HUD.
- Como parte de la rutina de las 2:00 PM ("Métricas obtenidas").

## Pasos

1. Lee `vault/outputs/metrics.json` si ya existe, para conocer los valores del corte anterior.
2. Reúne los números nuevos de las fuentes que el usuario tenga conectadas (suscriptores, vistas, seguidores, tareas resueltas, notas nuevas en la bóveda). Si una fuente no está conectada, deja el valor anterior y márcalo con `"fuente": "manual"`.
3. Escribe el resultado en `vault/outputs/metrics.json` con esta forma:
   ```json
   {
     "actualizado": "YYYY-MM-DDTHH:MM:SS",
     "senales_activas": 0,
     "consultas": 0,
     "tareas_resueltas": 0,
     "notas_boveda": 0,
     "seguidores_activos": 0,
     "objetivo_seguidores": 100000
   }
   ```
4. Agrega una entrada corta en `vault/raw/` con la fecha de hoy resumiendo qué cambió (una nota cruda, sin formatear).
5. No inventes números. Si no hay dato real, repite el último valor conocido en vez de adivinar.

## Regla

Una habilidad, un propósito: esta skill solo mueve números a `metrics.json`. No escribe resúmenes ni prioridades — de eso se encargan `bandeja` y `plan`.
