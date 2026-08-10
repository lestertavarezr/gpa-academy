/**
 * GPA Academy — Fix para error 500 de Anthropic API
 * Usar en: wweb-server.js (Bot Luz) y workflows de N8N
 *
 * PROBLEMA: api_error / Internal server error (500) — req_011Cb6h6A9E9pwvt7vt8ovYK
 * CAUSA: Error transitorio en servidores de Anthropic (no es un bug en tu código)
 * SOLUCIÓN: Retry automático con backoff exponencial
 */

const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  maxRetries: 3,      // ← El SDK oficial ya tiene esto incorporado
  timeout: 30_000,    // 30 segundos de timeout
})

// ─────────────────────────────────────────────────────────────────────────────
// OPCIÓN A: Usar el SDK oficial (RECOMENDADO)
// El SDK de Anthropic ya maneja reintentos automáticamente
// ─────────────────────────────────────────────────────────────────────────────
async function sendMessageConSDK(userMessage, systemPrompt = null) {
  try {
    const params = {
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userMessage }],
    }
    if (systemPrompt) params.system = systemPrompt

    const response = await client.messages.create(params)
    return response.content[0].text

  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error(`[Claude] Error ${error.status} — ${error.message}`)
      console.error(`[Claude] Request ID: ${error.headers?.['request-id'] ?? 'N/A'}`)

      if (error.status === 500) {
        // Error del servidor de Anthropic — ya se reintentó 3 veces, escalar
        throw new Error('Servicio de IA temporalmente no disponible. Intenta en unos minutos.')
      }
      if (error.status === 401) {
        throw new Error('API Key de Anthropic inválida. Verificar configuración.')
      }
      if (error.status === 429) {
        throw new Error('Límite de peticiones alcanzado. Espera un momento.')
      }
    }
    throw error
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// OPCIÓN B: Retry manual si no usas el SDK oficial (fetch directo)
// ─────────────────────────────────────────────────────────────────────────────
async function sendMessageConFetch(userMessage, systemPrompt = null, maxRetries = 3) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  let lastError = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = 1000 * Math.pow(2, attempt - 1) + Math.random() * 500
      console.warn(`[Claude] Reintento ${attempt}/${maxRetries} en ${Math.round(delay)}ms...`)
      await new Promise(r => setTimeout(r, delay))
    }

    try {
      const body = {
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: userMessage }],
      }
      if (systemPrompt) body.system = systemPrompt

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(body),
      })

      const requestId = res.headers.get('request-id')

      if (res.ok) {
        const data = await res.json()
        return data.content[0].text
      }

      const err = await res.json().catch(() => ({}))
      const tipo = err?.error?.type ?? 'unknown'
      const msg = err?.error?.message ?? res.statusText
      console.error(`[Claude] ${res.status} (${tipo}) — RequestID: ${requestId} — ${msg}`)

      // Solo reintentar en errores de servidor Anthropic (5xx)
      if (res.status < 500) throw new Error(`Error ${res.status}: ${msg}`) // 4xx → no reintentar

      lastError = new Error(`Error ${res.status}: ${msg}`)

    } catch (err) {
      if (err.message?.startsWith('Error 4')) throw err // No reintentar 4xx
      lastError = err
      console.error(`[Claude] Error en intento ${attempt + 1}:`, err.message)
    }
  }

  throw lastError ?? new Error('Error desconocido después de todos los reintentos')
}

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRACIÓN CON BOT LUZ (wweb-server.js)
// Reemplaza tu función actual de llamada a Claude con esto:
// ─────────────────────────────────────────────────────────────────────────────
async function responderConIA(mensaje, contextoSistema) {
  try {
    const respuesta = await sendMessageConSDK(mensaje, contextoSistema)
    return respuesta
  } catch (error) {
    console.error('[Bot Luz] Error al llamar a Claude:', error.message)
    // Respuesta de fallback para no dejar al usuario sin respuesta
    return 'Disculpa, estoy experimentando un problema técnico momentáneo. Por favor intenta en unos minutos o contacta al equipo de GPA Academy directamente.'
  }
}

module.exports = { sendMessageConSDK, sendMessageConFetch, responderConIA }
