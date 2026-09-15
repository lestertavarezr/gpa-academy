import { NextRequest, NextResponse } from 'next/server'
import { mcpData, McpStudentStatus } from '@/lib/mcp-data'
import { McpHttpError, mcpGet, parsePositiveInt } from '@/lib/mcp-http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ESTADOS = new Set<McpStudentStatus>(['activo', 'inactivo', 'graduado', 'suspendido'])

export const GET = mcpGet(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const programaId = searchParams.get('programa_id') || undefined
  const estado = searchParams.get('estado') || undefined
  if (estado && !ESTADOS.has(estado as McpStudentStatus)) {
    throw new McpHttpError(422, 'INVALID_PARAMETER', 'estado no es válido')
  }

  const page = parsePositiveInt(searchParams.get('page'), 'page', 1, 100000)
  const limit = parsePositiveInt(searchParams.get('limit'), 'limit', 25, 100)
  const data = mcpData.listStudents({ programaId, estado: estado as McpStudentStatus | undefined, page, limit })
  return NextResponse.json({ data, meta: { page: data.page, limit: data.limit, total: data.total } })
})
