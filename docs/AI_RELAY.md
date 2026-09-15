# Relay ChatGPT ↔ Claude mediante GitHub

Este flujo usa un issue como bitácora común: ChatGPT redacta una propuesta, Claude la revisa y ChatGPT publica una síntesis. El workflow **no modifica código**, no hace `push` y no ejecuta comandos generados por los modelos.

## Activación

1. En GitHub, cree la etiqueta `ai-relay`.
2. En un issue, aplique esa etiqueta para iniciar el relay.
3. Para una nueva ronda, un miembro del repositorio comenta `/relay` seguido de una petición opcional.

Los comentarios de usuarios externos no disparan el workflow; esto evita uso no autorizado de las claves. También se puede lanzar manualmente desde la pestaña **Actions**, indicando el número de issue.

## Secretos y variables del repositorio

En **Settings → Secrets and variables → Actions**, cree estos secretos:

| Tipo | Nombre | Valor |
| --- | --- | --- |
| Secret | `OPENAI_API_KEY` | Clave de la API de OpenAI; una suscripción de ChatGPT no sirve como sustituto. |
| Secret | `ANTHROPIC_API_KEY` | Clave de la API de Anthropic. |

Opcionalmente, configure estas variables de Actions para seleccionar modelos permitidos por cada cuenta:

| Variable | Valor predeterminado si se omite |
| --- | --- |
| `OPENAI_MODEL` | `gpt-5` |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-5-20250929` |

`GITHUB_TOKEN` lo suministra automáticamente GitHub Actions y se limita a leer el repositorio y crear comentarios en issues. Nunca incluya claves en issues, commits, logs ni archivos `.env` versionados.

## Coste y control

Cada ronda hace dos llamadas a OpenAI y una a Anthropic. Solo miembros, colaboradores u owners pueden reiniciar el relay mediante comentarios. Para detenerlo, quite la etiqueta o deje de usar `/relay`.

## Prueba

Tras añadir los secretos, abra un issue de prueba con una pregunta concreta, aplique `ai-relay` y revise el comentario generado. El resultado debe contener una propuesta, una revisión y una síntesis, sin cambios automáticos sobre el repositorio.
