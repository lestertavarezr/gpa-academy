import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

export class McpHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof McpHttpError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message } },
      { status: error.status },
    )
  }

  // Los detalles se preservan únicamente en el log del servidor.
  console.error('[mcp-api] Error inesperado', error)
  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message: 'Error interno del servidor' } },
    { status: 500 },
  )
}

/** Autenticación de servicio independiente de la sesión del dashboard. */
export function requireServiceToken(request: NextRequest) {
  const configuredToken = process.env.MCP_SERVICE_TOKEN
  if (!configuredToken) {
    console.error('[mcp-api] MCP_SERVICE_TOKEN no está configurado')
    throw new McpHttpError(500, 'MCP_NOT_CONFIGURED', 'Integración MCP no configurada')
  }

  const header = request.headers.get('authorization')
  const suppliedToken = header?.startsWith('Bearer ') ? header.slice(7) : ''
  const expected = Buffer.from(configuredToken)
  const supplied = Buffer.from(suppliedToken)

  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) {
    throw new McpHttpError(401, 'UNAUTHORIZED', 'Token de servicio inválido o ausente')
  }
}

export function parsePositiveInt(value: string | null, field: string, fallback: number, maximum: number) {
  if (value === null) return fallback
  if (!/^\d+$/.test(value)) {
    throw new McpHttpError(422, 'INVALID_PARAMETER', `${field} debe ser un entero positivo`)
  }
  const parsed = Number(value)
  if (parsed < 1 || parsed > maximum) {
    throw new McpHttpError(422, 'INVALID_PARAMETER', `${field} debe estar entre 1 y ${maximum}`)
  }
  return parsed
}

export function requireId(value: string, label = 'id') {
  if (!value || value.length > 128) {
    throw new McpHttpError(422, 'INVALID_PARAMETER', `${label} no es válido`)
  }
  return value
}

export function mcpGet<TContext>(
  handler: (request: NextRequest, context: TContext) => Promise<NextResponse>,
) {
  return async (request: NextRequest, context: TContext) => {
    try {
      requireServiceToken(request)
      const response = await handler(request, context)
      response.headers.set('Cache-Control', 'no-store')
      return response
    } catch (error) {
      return errorResponse(error)
    }
  }
}
