# Sistema JARVIS (V.A.U.L.T.)

Implementacion completa del sistema personal de 4 piezas: cerebro de skills,
memoria en archivos planos, voz local y un HUD de una sola pantalla. Vive
junto a `GPA_Academy_App.html` pero es independiente.

## Inicio rapido

```bash
# desde la raiz del repo
python3 -m http.server 8080

# abre en Chrome/Edge
# http://localhost:8080/jarvis/index.html
```

Concede permiso de microfono cuando el navegador lo pida.

## Redes sociales: Instagram

El sistema esta conectado a **Instagram** (metricas reales + sugerencias de
contenido). Para activarlo:

1. Sigue **`INSTAGRAM_SETUP.md`** — te guia para sacar un token real de la
   Instagram Graph API (15-20 min, gratis).
2. Completa `vault/wiki/nicho.md` con tu nicho real — las skills de
   tendencias/sugerencias lo necesitan para no inventar contenido generico.
3. Con Claude Code corriendo localmente (donde vive tu `.env`), pide que
   corra las skills `instagram` → `tendencias` → `sugerencias`, en ese
   orden.

Sin esos pasos, el HUD muestra "INSTAGRAM SIN CONECTAR" honestamente en vez
de numeros inventados.

## Paso 1 — Cerebro (`.claude/skills/`)

7 skills con formato SKILL.md, cargadas automaticamente por Claude Code:

| Skill | Que hace |
|---|---|
| `instagram` | Llama la Instagram Graph API real → `metrics.json` + `instagram-posts.md` |
| `tendencias` | Investiga (WebSearch) que se mueve en tu nicho → `tendencias.md` |
| `sugerencias` | Cruza tus posts reales + tendencias investigadas → `sugerencias.md` |
| `bandeja` | Resume correo + calendario en `vault/outputs/bandeja-hoy.md` |
| `plan` | Escribe las 3 prioridades del dia en `vault/outputs/plan-hoy.md` |
| `boveda` | Lee/escribe `vault/`, mantiene el grafo de `[[wikilinks]]` |
| `metricas` | Plantilla generica para cuando conectes una segunda red social |

## Paso 2 — Memoria (`vault/`)

```
vault/
  raw/             — todo capturado, sin depurar
  wiki/            — conocimiento depurado, enlazado con [[wikilinks]]
  outputs/         — lo que cada skill entrega
  manifest.json    — indice de archivos (el HUD lo necesita)
```

Archivos de salida disponibles:

| Archivo | Comando del HUD | Quien lo escribe |
|---|---|---|
| `metrics.json` | EXTRAER METRICAS | skill `instagram` |
| `instagram-posts.md` | TOP POSTS IG | skill `instagram` |
| `tendencias.md` | ESCANEO TENDENCIAS | skill `tendencias` |
| `sugerencias.md` | SUGERENCIAS | skill `sugerencias` |
| `reporte-am.md` | REPORTE AM | skill `bandeja` |
| `bandeja-hoy.md` | RESUMEN BANDEJA | skill `bandeja` |
| `plan-hoy.md` | PLAN DE HOY | skill `plan` |
| `plan-manana.md` | PLAN MANANA | skill `plan` |
| `revision-semanal.md` | REVISION SEMANAL | skill `boveda` |
| `agenda.json` | leido automaticamente por la agenda | manual |

Todo es Markdown y JSON plano — sin base de datos.

## Paso 3 — Voz (navegador)

Integrada en el HUD con Web Speech API del navegador:

- **STT** (te escucha): `SpeechRecognition` / `webkitSpeechRecognition`. En
  Chrome/Edge, el audio se envia a los servidores de Google para
  transcribirlo — **requiere internet, no es on-device**. Sin costo de API
  propia porque el navegador la trae integrada, pero no es privado en el
  sentido estricto (Google procesa el audio).
- **TTS** (te habla): `speechSynthesis` — esto si corre localmente, con las
  voces instaladas en tu sistema operativo.
- Ni STT ni TTS requieren una API key tuya ni un backend propio.
- El microfono necesita un origen seguro (`https://` o `localhost`) — no
  funciona abriendo el archivo con `file://`, y probablemente tampoco dentro
  de un iframe con sandbox (como una vista previa embebida) que no delegue
  el permiso de microfono.

### Controles

- **Boton del microfono**: manten presionado para hablar, suelta para enviar
- **Barra espaciadora**: push-to-talk (igual que el boton)
- **Teclas 1-0**: ejecuta los 10 comandos por numero (1=metricas, 2=reporte, ..., 0=boveda)

### Comandos de voz reconocidos

Di cualquiera de estas palabras y el sistema ejecuta la skill:

`metricas` · `bandeja` · `resumen` · `reporte` · `posts` · `top` ·
`tendencias` · `sugerencias` · `sugerir` · `plan` · `manana` · `boveda` ·
`limpieza` · `semanal` · `revision`

## Paso 4 — La cara (`jarvis/index.html`)

Una pantalla, sin pestanas, sin dependencias, sin build step.

### Que muestra

- **Vitales del sistema**: datos reales del navegador (CPU, memoria heap, red,
  bateria, notas en boveda, archivos de salida) con indicadores de tendencia
- **Barra de navegacion**: NUCLEO, IDEAS, ENLACE, EN LINEA, NUMEROS, ACTIVO
- **Panel de comandos**: 10 botones, cada uno lee su archivo de `vault/outputs/`
  y lo muestra + lee en voz alta. Indicador de actividad animado
- **Visualizacion central**: 350 particulas animadas en canvas, reacciona
  cuando el sistema escucha, habla o ejecuta. Stat ciclico que rota cada 5s
  entre seguidores, alcance, impresiones, visitas al perfil y engagement
  promedio (o "INSTAGRAM SIN CONECTAR" si `.env` no esta configurado)
- **Agenda**: leida de `agenda.json`, resalta el bloque actual, atenua los pasados
- **Audio E/S**: estado de STT/TTS/privacidad con indicadores visuales
- **Toast**: notificacion emergente al completar cada comando
- **Sparkline**: grafico de linea con gradiente de las metricas acumuladas
- **Auto-refresh**: todos los datos se recargan cada 30 segundos
- **Footer**: conteo de archivos en la boveda y estado del sistema en vivo

### Responsive

- **Desktop** (>1100px): 3 columnas
- **Tablet** (900-1100px): 3 columnas comprimidas
- **Tablet vertical** (600-900px): 2 columnas, globo arriba
- **Movil** (<600px): 1 columna, scroll vertical, nav oculta

### Estructura de archivos

```
gpa-academy/
  .claude/skills/
    instagram/SKILL.md
    tendencias/SKILL.md
    sugerencias/SKILL.md
    bandeja/SKILL.md
    plan/SKILL.md
    boveda/SKILL.md
    metricas/SKILL.md   (plantilla generica, no se usa para Instagram)
  vault/
    raw/
      2026-08-11-captura-inicial.md
    wiki/
      sistema-jarvis.md
      cerebro.md
      memoria.md
      voz.md
      cara.md
      directivas.md
      nicho.md           (completar con tu nicho real)
    outputs/
      metrics.json
      instagram-posts.md
      sugerencias.md
      agenda.json
      plan-hoy.md
      plan-manana.md
      bandeja-hoy.md
      tendencias.md
      reporte-am.md
      revision-semanal.md
    manifest.json
  jarvis/
    index.html
  .env.example          (copiar a .env, llenar, nunca commitear)
  .gitignore
  JARVIS.md              (este archivo)
  INSTAGRAM_SETUP.md      (guia para conectar tu cuenta)
  GPA_Academy_App.html   (app existente, no modificada)
```

## Limites honestos

- Los vitales son los que un navegador puede leer de verdad — no hay acceso a
  CPU/RAM real del OS desde JavaScript. Se etiquetan con su fuente real.
- Sin token de Instagram, `metrics.json` queda en cero con
  `"estado":"sin_conectar"` — el HUD lo muestra tal cual, no rellena con
  numeros de ejemplo. Sigue `INSTAGRAM_SETUP.md` para conectarlo de verdad.
- Instagram no tiene una API publica de tendencias (a diferencia de
  YouTube) — la skill `tendencias` investiga con WebSearch en vez de llamar
  un endpoint que no existe. Es investigacion real, pero no es un feed
  oficial de Meta.
- La skill `sugerencias` se niega a inventar ideas si no hay datos reales
  (posts propios + tendencias investigadas) — por diseno, no por bug.
- El STT (reconocimiento de voz) en Chrome envia el audio a los servidores de
  Google para transcribirlo — no es on-device ni 100% privado, a pesar de que
  una version anterior de este documento lo describia asi. Si necesitas STT
  verdaderamente local, hay que reemplazar `webkitSpeechRecognition` por un
  modelo on-device (ej. whisper.cpp corriendo en tu maquina, expuesto por un
  pequeno servidor local) — eso ya requiere un backend propio, no solo el
  navegador.
- STT funciona en Chromium (Chrome, Edge, Brave). Firefox y Safari no
  implementan `webkitSpeechRecognition` de la misma forma — el HUD lo detecta
  y avisa en vez de fallar.
- El HUD necesita servirse por HTTP (`python3 -m http.server` o cualquier
  servidor estatico). No funciona abriendo el archivo directamente (`file://`)
  porque `fetch()` y el microfono requieren un origen seguro.
