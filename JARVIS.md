# Sistema JARVIS (V.A.U.L.T.)

Implementación de las 4 piezas del sistema personal descrito en la guía: un
cerebro de skills, una memoria en archivos planos, voz local y un HUD de una
sola pantalla. Vive junto a `GPA_Academy_App.html` pero es un sistema
independiente — no depende de esa app ni la modifica.

## Paso 1 — Cerebro (`.claude/skills/`)

Cinco skills, cada una con un solo propósito, siguiendo el formato que
Claude Code carga automáticamente en este proyecto:

| Skill | Carpeta | Qué hace |
|---|---|---|
| `metricas` | `.claude/skills/metricas/SKILL.md` | Extrae los números del día a `vault/outputs/metrics.json` |
| `bandeja` | `.claude/skills/bandeja/SKILL.md` | Resume correo + calendario + noticias en `vault/outputs/bandeja-hoy.md` |
| `tendencias` | `.claude/skills/tendencias/SKILL.md` | Escanea señales externas a `vault/outputs/tendencias.md` |
| `plan` | `.claude/skills/plan/SKILL.md` | Escribe las 3 prioridades del día en `vault/outputs/plan-hoy.md` |
| `boveda` | `.claude/skills/boveda/SKILL.md` | Lee/escribe `vault/`, mantiene el grafo de `[[wikilinks]]` |

Al abrir este repo con Claude Code, las 5 skills quedan disponibles sin
configuración extra.

## Paso 2 — Memoria (`vault/`)

```
vault/
  raw/       — todo capturado, sin depurar (una nota por día)
  wiki/      — conocimiento depurado, notas enlazadas con [[wikilinks]]
  outputs/   — lo que cada skill entrega (metrics.json, agenda.json, *.md)
  manifest.json — lista de qué archivos existen (el HUD la usa para saber
                  qué puede leer, porque un sitio estático no puede listar
                  un directorio por sí solo)
```

Todo es Markdown y JSON planos — sin base de datos. Si agregas o quitas un
archivo de `vault/`, actualiza `vault/manifest.json` (lo hace la skill
`boveda`).

## Paso 3 — Voz local

Integrada directamente en el HUD, sin backend ni API de pago:

- **STT**: `SpeechRecognition` / `webkitSpeechRecognition` del navegador.
- **TTS**: `speechSynthesis` del navegador.
- El audio nunca sale de la máquina — no hay llamada de red, no hay
  latencia de API, es gratis siempre.
- Requiere un navegador basado en Chromium servido por `http://localhost`
  o `https://` (los navegadores bloquean el micrófono en `file://`).

Uso: mantén presionado el botón del micrófono, habla un comando ("plan de
hoy", "resumen bandeja", "extraer métricas", "escaneo tendencias", "limpieza
bóveda"), suelta — el HUD ejecuta el comando y responde en voz alta.

## Paso 4 — La cara (`jarvis/index.html`)

Una sola pantalla, sin pestañas: vitales del sistema, panel de comandos,
agenda del día, estado de audio E/S y las notas de la bóveda — todo en un
único archivo HTML/CSS/JS sin dependencias ni build step.

- **Vitales**: reales, no simulados — núcleos de CPU (`navigator.hardwareConcurrency`),
  memoria del heap de JS (`performance.memory`, Chrome/Edge), tipo de red
  (`navigator.connection`), batería (`navigator.getBattery`) y conteo real de
  notas en la bóveda.
- **Panel de comandos**: cada botón corre una skill de verdad — lee el
  archivo correspondiente en `vault/outputs/` y lo muestra/lee en voz alta.
  Los comandos que dependen de una fuente externa no conectada (GitHub
  trending, YouTube) quedan marcados como simulados hasta que se les dé una
  API key.
- **Agenda**: leída de `vault/outputs/agenda.json`, resalta el bloque
  actual.
- **Visualización central**: partículas animadas en `<canvas>`, reacciona
  (color) cuando el sistema está escuchando, hablando o ejecutando un
  comando.

### Cómo correrlo

El HUD hace `fetch()` a `vault/`, así que necesita servirse por HTTP (no
`file://`):

```bash
# desde la raíz del repo
python3 -m http.server 8080
# abre http://localhost:8080/jarvis/index.html
```

Concede permiso de micrófono cuando el navegador lo pida para usar la voz.

## Límites honestos

- Los "vitales" son los que un navegador realmente puede leer — no hay
  acceso a CPU/RAM real del sistema operativo desde JS por razones de
  seguridad del navegador. Se etiquetan con su fuente real (`navigator`,
  `heap`, etc.) en vez de inventar un número de "uso de CPU del sistema".
- Comandos como "TENDENCIAS GH" o "YT SEMANAL" necesitan credenciales reales
  (API keys/OAuth) para dejar de ser simulados — el HUD lo indica en el log
  cuando los ejecutas.
- El reconocimiento de voz (`webkitSpeechRecognition`) es soporte de
  Chromium; Firefox/Safari no lo implementan igual, y el HUD lo detecta y
  avisa en vez de fallar en silencio.
