# Voz

STT y TTS corren con la Web Speech API del navegador. Mantén presionado el
botón del micrófono en el HUD ([[cara]]) para hablar; suelta para enviar el
comando.

- **TTS** (el sistema te habla): local, usa las voces del sistema operativo.
- **STT** (el sistema te escucha): en Chrome/Edge, el audio se envía a los
  servidores de Google para transcribirlo — requiere internet, no es
  on-device. No hay costo ni API key propia porque el navegador la trae
  integrada, pero no es 100% privado en el sentido estricto.

Gratis (sin API key que pagar). No requiere backend propio. Ver [[cara]].
