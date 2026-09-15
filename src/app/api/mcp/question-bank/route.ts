import { NextRequest } from 'next/server'
import { McpHttpError, mcpGet, parsePositiveInt } from '@/lib/mcp-http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * La app actual no tiene entidad ni fuente de datos para el banco de preguntas.
 * Se conserva la ruta para que el contrato MCP sea estable, pero se devuelve un
 * error explícito en vez de fabricar contenido académico.
 */
export const GET = mcpGet(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  parsePositiveInt(searchParams.get('page'), 'page', 1, 100000)
  parsePositiveInt(searchParams.get('limit'), 'limit', 25, 100)
  throw new McpHttpError(
    503,
    'QUESTION_BANK_UNAVAILABLE',
    'El banco de preguntas aún no está conectado a GPA Academy OS.',
  )
})
