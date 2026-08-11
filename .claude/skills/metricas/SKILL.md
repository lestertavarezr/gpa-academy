---
name: metricas
description: Skill generica de metricas para cuando el usuario conecte otra plataforma ademas de Instagram. Para Instagram, usa la skill `instagram` en su lugar — esta existe para el dia que se agregue una segunda red.
---

# Skill: métricas (genérica)

Propósito único: extraer números de una plataforma nueva y dejarlos en
`vault/outputs/metrics.json`, siguiendo el mismo esquema que usa `instagram`.

**Para Instagram, no uses esta skill — usa `instagram`, que ya llama la
Graph API real.** Esta skill genérica queda como plantilla para cuando el
usuario conecte una segunda red social (TikTok, YouTube, etc.).

## Cuándo se activa

- El usuario pide métricas de una plataforma que todavía no tiene skill
  propia.

## Pasos

1. Lee `vault/outputs/metrics.json` si ya existe, para no pisar datos de
   otra plataforma sin avisar — si ya hay una entrada de Instagram ahí,
   pregunta al usuario cómo quiere combinar ambas antes de sobrescribir.
2. Reúne los números reales de la fuente conectada. Si no hay credenciales,
   dile al usuario qué necesita configurar — no inventes valores.
3. Escribe el resultado en `vault/outputs/metrics.json` siguiendo el mismo
   esquema que `instagram` (`actualizado`, `plataforma`, `seguidores`, etc.)
   para que el HUD no tenga que cambiar.
4. No inventes números. Si no hay dato real, repite el último valor
   conocido en vez de adivinar.

## Regla

Una habilidad, un propósito: esta skill solo mueve números a
`metrics.json`. No escribe resúmenes ni prioridades — de eso se encargan
`bandeja` y `plan`.
