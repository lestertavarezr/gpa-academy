# Conectar Instagram — paso a paso

Esto te da un token real para que la skill `instagram` traiga tus métricas
de verdad (seguidores, alcance, engagement) en vez de ceros. Te toma unos
15-20 minutos la primera vez. No necesitas tarjeta de crédito ni pagar nada.

Usamos el flujo **"Instagram API with Instagram Login"** — es el más nuevo
de Meta y, a diferencia del flujo viejo, no requiere que tengas una Página
de Facebook vinculada a tu Instagram.

## 1. Convierte tu cuenta a Profesional

En la app de Instagram: `Perfil → Editar perfil → Cambiar a cuenta
profesional` (o `Configuración → Cuenta → Cambiar a cuenta profesional`).
Elige Creador o Empresa, el que te describa mejor — para la API da igual.

## 2. Crea (o entra a) tu cuenta de desarrollador de Meta

Ve a **developers.facebook.com**, inicia sesión con una cuenta de Facebook
(el portal de desarrolladores vive ahí aunque tu Instagram no esté
vinculado a ninguna Página) y acepta los términos de desarrollador si es tu
primera vez.

## 3. Crea una App

`Mis Apps → Crear app`. Cuando te pregunte el tipo/caso de uso, elige la
opción relacionada con acceder a datos de Instagram o "Business" — el
asistente de Meta cambia de vez en cuando, sigue el que te muestre.

## 4. Agrega el producto "Instagram"

Dentro del panel de tu app, en la lista de productos, agrega **Instagram**
(Instagram API with Instagram Login).

## 5. Agrégate como usuario de prueba

En la configuración del producto Instagram, agrega tu cuenta como
**Instagram tester**. Esto genera una invitación — acéptala desde la app de
Instagram en `Configuración → Apps y sitios web → Invitaciones de prueba`.
Sin este paso el token no va a funcionar contra tu cuenta.

## 6. Genera el token (la forma rápida, sin montar backend)

Ve a **developers.facebook.com/tools/explorer** (Graph API Explorer),
selecciona tu app, y genera un token de usuario pidiendo estos permisos:

- `instagram_business_basic`
- `instagram_business_manage_insights`

## 7. Cámbialo por un token de larga duración (60 días)

El token del Explorer dura ~1 hora. Cámbialo por uno de 60 días:

```bash
curl -i -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=<TU_APP_SECRET>&access_token=<TOKEN_CORTO>"
```

`TU_APP_SECRET` está en la configuración básica de tu app en Meta for
Developers (Configuración → Básica → Clave secreta de la app).

## 8. Obtén tu ID de cuenta

```bash
curl -i -X GET "https://graph.instagram.com/v21.0/me?fields=id,username&access_token=<TU_TOKEN_LARGO>"
```

El `id` que devuelve es tu `IG_BUSINESS_ID`.

## 9. Llena tu `.env`

```bash
cp .env.example .env
```

Edita `.env` y pon el token del paso 7 en `IG_ACCESS_TOKEN`, y el id del
paso 8 en `IG_BUSINESS_ID`. **Nunca pegues estos valores en el chat de
Claude ni los subas al repo** — `.env` ya está en `.gitignore`.

## 10. Corre la skill

Con Claude Code abierto en este repo (localmente, donde vive tu `.env`),
pide: *"corre la skill instagram"*. Va a llamar la API real y dejar tus
métricas en `vault/outputs/metrics.json` e `instagram-posts.md`. El HUD
(`jarvis/index.html`) los va a mostrar la próxima vez que recargues o
pulses "EXTRAER MÉTRICAS".

## Mantenimiento

El token de 60 días expira. Antes de que expire, repite el paso 7 (Meta
permite refrescar un token de larga duración que todavía no haya vencido,
extendiéndolo otros 60 días). Si te da error `190` al correr la skill, es
que ya venció — repite desde el paso 6.

## Por qué no hay "tendencias" de Instagram por API

Instagram no expone una API pública de tendencias/trending como YouTube.
Por eso la skill `tendencias` no llama ninguna API — usa las herramientas
de búsqueda web de Claude Code para investigar qué se mueve en tu nicho, y
la skill `sugerencias` cruza eso con tus posts reales de mejor desempeño.
