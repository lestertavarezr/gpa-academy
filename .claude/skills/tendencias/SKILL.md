---
name: tendencias
description: Escanea qué se está moviendo (GitHub trending, YouTube, redes) y deja un reporte corto de señales relevantes en vault/outputs/tendencias.md.
---

# Skill: tendencias

Propósito único: escanear lo que se mueve afuera y dejar solo las señales que importan.

## Cuándo se activa

- Rutina semanal ("Tendencias GH", "YT semanal").
- El usuario dice "escaneo tendencias" o pulsa "ESCANEO TENDENCIAS" en el HUD.

## Pasos

1. Recorre las fuentes configuradas (GitHub trending, YouTube, lo que el usuario haya definido).
2. Descarta ruido: solo conserva señales con relación directa a los temas activos en `vault/wiki/`.
3. Para cada señal relevante, escribe una línea: `- [tema] título — por qué importa (1 frase) — enlace`.
4. Guarda el reporte en `vault/outputs/tendencias.md`, con fecha en el encabezado.
5. Si una señal se repite 3 días seguidos, promuévela a una nota en `vault/wiki/` (deja de ser ruido, pasa a ser conocimiento).

## Regla

Esta skill no ejecuta acciones ni crea tareas — solo detecta y reporta. Eso lo decide el usuario, o la skill `plan`.
