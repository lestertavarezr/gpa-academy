import fs from 'node:fs/promises'

const GITHUB_API = 'https://api.github.com'
const MAX_ISSUE_CHARS = 12_000
const MAX_MODEL_CHARS = 8_000

function requireEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Falta la variable requerida ${name}.`)
  return value
}

function truncate(value, length = MAX_MODEL_CHARS) {
  const text = String(value ?? '').trim()
  return text.length > length ? `${text.slice(0, length)}\n\n[contenido truncado]` : text
}

async function request(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) {
    const payload = await response.text()
    throw new Error(`Solicitud falló (${response.status}): ${truncate(payload, 500)}`)
  }
  return response.json()
}

function githubHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${requireEnv('GITHUB_TOKEN')}`,
    'X-GitHub-Api-Version': '2022-11-28',
  }
}

async function getIssue(event, repository, issueNumber) {
  if (event?.issue) return event.issue
  return request(`${GITHUB_API}/repos/${repository}/issues/${issueNumber}`, { headers: githubHeaders() })
}

async function comment(repository, issueNumber, body) {
  await request(`${GITHUB_API}/repos/${repository}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  })
}

async function askOpenAI(instructions, input) {
  const payload = await request('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireEnv('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5',
      instructions,
      input: truncate(input),
      max_output_tokens: 1_400,
      store: false,
    }),
  })

  const text = payload.output_text ?? payload.output
    ?.flatMap((item) => item.content ?? [])
    .filter((block) => block.type === 'output_text')
    .map((block) => block.text)
    .join('\n')
  if (!text) throw new Error('OpenAI no devolvió texto de salida.')
  return truncate(text)
}

async function askClaude(system, prompt) {
  const payload = await request('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': requireEnv('ANTHROPIC_API_KEY'),
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
      max_tokens: 1_400,
      system,
      messages: [{ role: 'user', content: truncate(prompt) }],
    }),
  })

  const text = payload.content?.find((block) => block.type === 'text')?.text
  if (!text) throw new Error('Claude no devolvió texto de salida.')
  return truncate(text)
}

function taskFromIssue(issue, event) {
  const extra = event?.comment?.body?.replace(/^\/relay\s*/i, '')
  return truncate([
    `Título: ${issue.title}`,
    `Descripción:\n${issue.body || '(sin descripción)'}`,
    extra ? `Petición adicional del colaborador:\n${extra}` : '',
  ].filter(Boolean).join('\n\n'), MAX_ISSUE_CHARS)
}

async function main() {
  const repository = requireEnv('GITHUB_REPOSITORY')
  const issueNumber = requireEnv('ISSUE_NUMBER')
  const eventPath = process.env.GITHUB_EVENT_PATH
  const event = eventPath ? JSON.parse(await fs.readFile(eventPath, 'utf8')) : {}
  const issue = await getIssue(event, repository, issueNumber)
  const task = taskFromIssue(issue, event)

  try {
    const openaiProposal = await askOpenAI(
      'Eres ChatGPT, arquitecto de software. Analiza el issue y propone un plan técnico concreto. No ejecutes código ni afirmes haber realizado cambios. Señala riesgos, pruebas y archivos probables.',
      task,
    )
    const claudeReview = await askClaude(
      'Eres Claude, revisor técnico independiente. Revisa la propuesta de ChatGPT con rigor. Identifica omisiones, riesgos de seguridad y mejoras. Devuelve recomendaciones accionables y breves.',
      `${task}\n\n--- Propuesta de ChatGPT ---\n${openaiProposal}`,
    )
    const synthesis = await askOpenAI(
      'Eres ChatGPT, responsable de síntesis técnica. Combina la propuesta y revisión. Devuelve: decisión recomendada, pasos ordenados, riesgos pendientes y pruebas de aceptación. No inventes resultados ni modifiques código.',
      `${task}\n\n--- Propuesta inicial ---\n${openaiProposal}\n\n--- Revisión de Claude ---\n${claudeReview}`,
    )

    await comment(repository, issueNumber, [
      '## 🤖 Relay ChatGPT ↔ Claude',
      '',
      '### Propuesta de ChatGPT',
      openaiProposal,
      '',
      '### Revisión de Claude',
      claudeReview,
      '',
      '### Síntesis de ChatGPT',
      synthesis,
      '',
      '_Este comentario es una recomendación técnica; no aplica cambios automáticamente._',
    ].join('\n'))
  } catch (error) {
    console.error('[ai-relay]', error)
    await comment(
      repository,
      issueNumber,
      `## ⚠️ Relay ChatGPT ↔ Claude no ejecutado\n\n${truncate(error instanceof Error ? error.message : 'Error desconocido.', 500)}\n\nVerifica los secretos y variables documentados en \`docs/AI_RELAY.md\`.`,
    )
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error('[ai-relay] Error fatal', error)
  process.exitCode = 1
})
