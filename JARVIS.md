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

## Paso 1 — Cerebro (`.claude/skills/`)

5 skills con formato SKILL.md, cargadas automaticamente por Claude Code:

| Skill | Que hace |
|---|---|
| `metricas` | Extrae numeros del dia a `vault/outputs/metrics.json` |
| `bandeja` | Resume correo + calendario en `vault/outputs/bandeja-hoy.md` |
| `tendencias` | Escanea senales externas a `vault/outputs/tendencias.md` |
| `plan` | Escribe las 3 prioridades del dia en `vault/outputs/plan-hoy.md` |
| `boveda` | Lee/escribe `vault/`, mantiene el grafo de `[[wikilinks]]` |

## Paso 2 — Memoria (`vault/`)

```
vault/
  raw/             — todo capturado, sin depurar
  wiki/            — conocimiento depurado, enlazado con [[wikilinks]]
  outputs/         — lo que cada skill entrega
  manifest.json    — indice de archivos (el HUD lo necesita)
```

Archivos de salida disponibles:

| Archivo | Comando del HUD |
|---|---|
| `metrics.json` | EXTRAER METRICAS |
| `reporte-am.md` | REPORTE AM |
| `bandeja-hoy.md` | RESUMEN BANDEJA |
| `tendencias-gh.md` | TENDENCIAS GH |
| `tendencias.md` | ESCANEO TENDENCIAS |
| `yt-semanal.md` | YT SEMANAL |
| `plan-hoy.md` | PLAN DE HOY |
| `plan-manana.md` | PLAN MANANA |
| `revision-semanal.md` | REVISION SEMANAL |
| `agenda.json` | leido automaticamente por la agenda |

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

`metricas` · `bandeja` · `resumen` · `reporte` · `tendencias` · `github` ·
`plan` · `manana` · `boveda` · `limpieza` · `youtube` · `semanal` · `revision`

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
  entre senales, consultas, tareas, notas y seguidores
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
    metricas/SKILL.md
    bandeja/SKILL.md
    tendencias/SKILL.md
    plan/SKILL.md
    boveda/SKILL.md
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
    outputs/
      metrics.json
      agenda.json
      plan-hoy.md
      plan-manana.md
      bandeja-hoy.md
      tendencias.md
      tendencias-gh.md
      yt-semanal.md
      reporte-am.md
      revision-semanal.md
    manifest.json
  jarvis/
    index.html
  JARVIS.md           (este archivo)
  GPA_Academy_App.html (app existente, no modificada)
```

## Limites honestos

- Los vitales son los que un navegador puede leer de verdad — no hay acceso a
  CPU/RAM real del OS desde JavaScript. Se etiquetan con su fuente real.
- TENDENCIAS GH y YT SEMANAL tienen contenido de ejemplo — para datos en vivo
  necesitan GitHub API / YouTube Data API v3 con credenciales reales.
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
