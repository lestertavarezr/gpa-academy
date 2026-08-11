---
name: instagram
description: Extrae metricas reales de la cuenta de Instagram del usuario (seguidores, alcance, impresiones, engagement) via Instagram Graph API, y las escribe en vault/outputs/metrics.json y vault/outputs/instagram-posts.md.
---

# Skill: instagram

Propósito único: llamar la Instagram Graph API con las credenciales del
usuario y dejar sus métricas reales en la bóveda.

## Requisitos antes de correr esta skill

1. El usuario debe tener `.env` en la raíz del repo (copiado de
   `.env.example`) con `IG_ACCESS_TOKEN` y `IG_BUSINESS_ID` llenos. Si
   `.env` no existe o esas variables están vacías, **no inventes datos** —
   dile al usuario que siga `INSTAGRAM_SETUP.md` primero.
2. Nunca imprimas el valor del token en la conversación ni lo escribas en
   ningún archivo de `vault/` — vault/ es texto plano que puede terminar
   commiteado por accidente.

## Cuándo se activa

- El usuario dice "métricas de instagram" o pulsa "MÉTRICAS IG" en el HUD.
- Rutina de las 2:00 PM ("Métricas obtenidas"), si ya hay credenciales.

## Pasos

1. Carga `IG_ACCESS_TOKEN` e `IG_BUSINESS_ID` desde `.env` (con `source .env`
   o leyendo el archivo — nunca hardcodees el token en el comando final que
   quede visible en el historial de la nota).

2. Métricas de cuenta (últimos 7 y 30 días):
   ```bash
   curl -s "https://graph.facebook.com/v21.0/${IG_BUSINESS_ID}/insights?metric=reach,profile_views,accounts_engaged&period=day&since=<hace-7-dias-unix>&until=<hoy-unix>&access_token=${IG_ACCESS_TOKEN}"
   ```
   Seguidores actuales:
   ```bash
   curl -s "https://graph.facebook.com/v21.0/${IG_BUSINESS_ID}?fields=followers_count,media_count&access_token=${IG_ACCESS_TOKEN}"
   ```

3. Últimos posts + su desempeño:
   ```bash
   curl -s "https://graph.facebook.com/v21.0/${IG_BUSINESS_ID}/media?fields=id,caption,timestamp,media_type,permalink&limit=12&access_token=${IG_ACCESS_TOKEN}"
   ```
   Por cada `media_id` obtenido, pide sus insights:
   ```bash
   curl -s "https://graph.facebook.com/v21.0/<media_id>/insights?metric=reach,likes,comments,saved,shares&access_token=${IG_ACCESS_TOKEN}"
   ```

4. Escribe `vault/outputs/metrics.json`:
   ```json
   {
     "actualizado": "YYYY-MM-DDTHH:MM:SS",
     "plataforma": "instagram",
     "seguidores": 0,
     "seguidores_delta_7d": 0,
     "alcance_7d": 0,
     "impresiones_7d": 0,
     "visitas_perfil_7d": 0,
     "tasa_engagement_promedio": 0,
     "posts_analizados": 0
   }
   ```
   `tasa_engagement_promedio` = promedio de (likes+comments+saved+shares) /
   reach por post, en los posts analizados.

5. Escribe `vault/outputs/instagram-posts.md` — los posts ordenados de mayor
   a menor engagement, con su métrica y qué tipo de contenido era (reel,
   carrusel, foto), para que la skill `sugerencias` sepa qué está
   funcionando de verdad:
   ```markdown
   # Posts — actualizado YYYY-MM-DD

   1. [reel] "<primeras palabras del caption>" — alcance: X, engagement: Y% — <permalink>
   2. ...
   ```

6. Actualiza `vault/manifest.json` si es la primera vez que corre esta skill
   (agrega `outputs/instagram-posts.md` a la lista).

## Si algo falla

- Token vencido (error `190` de la API): el usuario necesita refrescarlo —
  señala el paso 6 de `INSTAGRAM_SETUP.md`, no intentes adivinar un token
  nuevo.
- Cuenta no es Business/Creator: la API de insights simplemente no
  devolverá datos — avisa al usuario en vez de escribir métricas en cero
  silenciosamente.

## Regla

Esta skill solo trae y guarda datos reales. No decide qué publicar — eso lo
hace `sugerencias`, leyendo lo que esta skill deja en la bóveda.
