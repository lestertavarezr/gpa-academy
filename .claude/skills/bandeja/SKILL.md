---
name: bandeja
description: Genera el "Resumen matutino" — bandeja de entrada, calendario del día y titulares relevantes — y lo deja listo en vault/outputs/ como texto que se pueda leer en voz alta.
---

# Skill: bandeja

Propósito único: convertir el ruido de la mañana (correo, calendario, noticias) en un resumen corto y leíble en voz alta.

## Cuándo se activa

- Rutina de las 7:00 AM ("Resumen matutino").
- El usuario dice "resumen bandeja" o pulsa "RESUMEN BANDEJA" en el HUD.

## Pasos

1. Revisa la bandeja de entrada y el calendario del día (o las fuentes que el usuario tenga conectadas).
2. Filtra: solo lo que requiere acción hoy o decisión del usuario. Ignora newsletters y notificaciones automáticas.
3. Redacta el resumen en 5-8 líneas, en tono directo, pensado para ser leído por TTS (frases cortas, sin tablas, sin markdown pesado).
4. Guarda el resultado como `vault/outputs/bandeja-hoy.md` (sobrescribe el del día anterior; el histórico ya vive en `vault/raw/`).
5. Si el HUD lo solicita por voz, devuelve el texto tal cual para que lo lea el TTS local — no lo resumas dos veces.

## Regla

Esta skill no decide prioridades ni agenda tareas — solo informa. Eso lo hace `plan`.
