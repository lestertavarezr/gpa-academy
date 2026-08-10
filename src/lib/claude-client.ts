/**
 * GPA Academy — Claude API Client con retry automático
 * Maneja errores 500 (Internal Server Error) de Anthropic con backoff exponencial
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const MAX_RETRIES = 3
const BASE_DELAY_MS = 1000 // 1s, 2s, 4s

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ClaudeRequestOptions {
  model?: string
  max_tokens?: number
  system?: string
  messages: Message[]
}

interface ClaudeResponse {
  id: string
  content: Array<{ type: string; text: string }>
  model: string
  stop_reason: string
  usage: { input_tokens: number; output_tokens: number }
}

class ClaudeAPIError extends Error {
  constructor(
    public status: number,
    public errorType: string,
    public requestId: string,
    message: string
  ) {
    super(message)
    this.name = 'ClaudeAPIError'
  }
}

/**
 * Determina si el error es recuperable (vale la pena reintentar)
 */
function isRetryableError(status: number): boolean {
  return status === 500 || status === 502 || status === 503 || status === 529
}

/**
 * Espera un tiempo con backoff exponencial + jitter aleatorio
 */
function sleep(attempt: number): Promise<void> {
  const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 500
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Envía un mensaje a Claude con retry automático
 * Resuelve el error: api_error / Internal server error (500)
 */
export async function sendMessageToClaude(
  apiKey: string,
  options: ClaudeRequestOptions
): Promise<ClaudeResponse> {
  const {
    model = 'claude-sonnet-4-6',
    max_tokens = 1024,
    system,
    messages,
  } = options

  let lastError: ClaudeAPIError | null = null

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      console.warn(`[Claude] Reintento ${attempt}/${MAX_RETRIES} tras error ${lastError?.status}...`)
      await sleep(attempt - 1)
    }

    try {
      const body: Record<string, unknown> = { model, max_tokens, messages }
      if (system) body.system = system

      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
        },
        body: JSON.stringify(body),
      })

      const requestId = response.headers.get('request-id') ?? 'unknown'

      if (response.ok) {
        const data = await response.json() as ClaudeResponse
        if (attempt > 0) {
          console.log(`[Claude] Éxito en intento ${attempt + 1}. Request ID: ${data.id}`)
        }
        return data
      }

      // Error de la API
      const errorData = await response.json().catch(() => ({})) as Record<string, unknown>
      const errorType = (errorData?.error as Record<string, unknown>)?.type as string ?? 'unknown_error'
      const errorMsg = (errorData?.error as Record<string, unknown>)?.message as string ?? response.statusText

      console.error(`[Claude] Error ${response.status} (${errorType}) — Request ID: ${requestId} — ${errorMsg}`)

      lastError = new ClaudeAPIError(response.status, errorType, requestId, errorMsg)

      // Solo reintentar en errores 5xx (servidor de Anthropic)
      if (!isRetryableError(response.status)) {
        throw lastError // 4xx no se reintenta
      }

    } catch (err) {
      if (err instanceof ClaudeAPIError) throw err
      // Error de red — reintentar
      console.error(`[Claude] Error de red en intento ${attempt + 1}:`, err)
      lastError = new ClaudeAPIError(0, 'network_error', 'n/a', String(err))
    }
  }

  throw lastError ?? new ClaudeAPIError(500, 'api_error', 'n/a', 'Max reintentos alcanzados')
}

/**
 * Helper: envía un mensaje simple y devuelve solo el texto
 */
export async function askClaude(
  apiKey: string,
  userMessage: string,
  systemPrompt?: string
): Promise<string> {
  const response = await sendMessageToClaude(apiKey, {
    messages: [{ role: 'user', content: userMessage }],
    system: systemPrompt,
  })
  return response.content[0]?.text ?? ''
}

export { ClaudeAPIError }
