import { NextRequest, NextResponse } from 'next/server'
import { mcpData } from '@/lib/mcp-data'
import { McpHttpError, mcpGet, requireId } from '@/lib/mcp-http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const GET = mcpGet(async (
  _request: NextRequest,
  context: { params: { id: string } },
) => {
  const id = requireId(context.params.id, 'id de programa')
  const data = mcpData.getProgramMetrics(id)
  if (!data) throw new McpHttpError(404, 'PROGRAM_NOT_FOUND', 'Programa no encontrado')
  return NextResponse.json({ data })
})
