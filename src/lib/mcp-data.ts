import { mockPrograms, mockStudents } from '@/lib/mock-data'

export type Page<T> = { items: T[]; page: number; limit: number; total: number }
export type McpStudentStatus = 'activo' | 'inactivo' | 'graduado' | 'suspendido'

export type StudentSummary = {
  id: string
  nombre: string
  programaId: string
  programa: string
  estado: McpStudentStatus
  fechaInscripcion: string
}

export type StudentProgress = {
  estudiante: { id: string; nombre: string }
  programa: { id: string; nombre: string } | null
  avancePorcentaje: number
  modulosCompletados: number
  modulosTotales: number
  nivelCompetenciaClinica: string
  puntos: number
  insignias: string[]
  actualizadoEn: string | null
}

export type ProgramMetrics = {
  programa: { id: string; nombre: string }
  inscritos: number
  completaron: number
  tasaFinalizacion: number
  nexusQuirurgico: { evaluados: number; promedio: number | null; aprobados: number }
  actualizadoEn: string | null
}

function toMcpStudentStatus(status: typeof mockStudents[number]['status']): McpStudentStatus {
  if (status === 'completado') return 'graduado'
  return status
}

function clinicalLevel(progress: number) {
  if (progress >= 90) return 'Competencia clínica avanzada'
  if (progress >= 70) return 'Competencia clínica en desarrollo'
  if (progress >= 40) return 'Competencia clínica inicial'
  return 'Fundamentos clínicos'
}

/**
 * Adaptador de solo lectura para la fuente de datos actual de GPA Academy OS.
 * Hoy el dashboard usa mock-data.ts; cuando se conecte un ORM, sustituir estas
 * funciones por el servicio de dominio correspondiente, manteniendo los tipos
 * seguros y sin devolver teléfonos, correos, estado de pago ni otros PII.
 */
export const mcpData = {
  listStudents(input: { programaId?: string; estado?: McpStudentStatus; page: number; limit: number }): Page<StudentSummary> {
    const filtered = mockStudents
      .filter((student) => !input.programaId || student.programId === input.programaId)
      .filter((student) => !input.estado || toMcpStudentStatus(student.status) === input.estado)
      .map((student) => ({
        id: student.id,
        nombre: student.name,
        programaId: student.programId,
        programa: student.program,
        estado: toMcpStudentStatus(student.status),
        fechaInscripcion: student.enrollmentDate,
      }))
    const start = (input.page - 1) * input.limit
    return { items: filtered.slice(start, start + input.limit), page: input.page, limit: input.limit, total: filtered.length }
  },

  getStudentProgress(id: string): StudentProgress | null {
    const student = mockStudents.find((item) => item.id === id)
    if (!student) return null
    const program = mockPrograms.find((item) => item.id === student.programId)
    const insignias = [
      ...(student.progress >= 25 ? ['Primer avance'] : []),
      ...(student.progress >= 75 ? ['Trayectoria clínica'] : []),
      ...(student.progress >= 100 ? ['Programa completado'] : []),
    ]
    return {
      estudiante: { id: student.id, nombre: student.name },
      programa: program ? { id: program.id, nombre: program.name } : null,
      avancePorcentaje: student.progress,
      modulosCompletados: Math.round((student.progress / 100) * 10),
      modulosTotales: 10,
      nivelCompetenciaClinica: clinicalLevel(student.progress),
      puntos: student.progress * 10,
      insignias,
      actualizadoEn: null,
    }
  },

  getProgramMetrics(id: string): ProgramMetrics | null {
    const program = mockPrograms.find((item) => item.id === id)
    if (!program) return null
    return {
      programa: { id: program.id, nombre: program.name },
      inscritos: program.studentsCount,
      completaron: Math.round(program.studentsCount * (program.completionRate / 100)),
      tasaFinalizacion: program.completionRate,
      // Este dashboard aún no tiene una fuente de resultados Nexus; no se inventan resultados.
      nexusQuirurgico: { evaluados: 0, promedio: null, aprobados: 0 },
      actualizadoEn: null,
    }
  },
}
