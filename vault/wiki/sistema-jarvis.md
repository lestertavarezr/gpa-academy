# Sistema (V.A.U.L.T.)

Cuatro piezas, cada una reemplazable por separado:

1. [[cerebro]] — Claude Code + `.claude/skills/`, una skill por propósito.
2. [[memoria]] — esta bóveda. Markdown plano, sin base de datos.
3. [[voz]] — STT/TTS local en el navegador, push-to-talk.
4. [[cara]] — el HUD (`jarvis/index.html`), una pantalla, sin pestañas.

## Regla general

Si no está en la bóveda, no pasó. Todo lo que las skills producen aterriza en
`vault/outputs/` como Markdown o JSON — nunca en memoria volátil del modelo.
