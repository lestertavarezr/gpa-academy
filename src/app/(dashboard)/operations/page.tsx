'use client'

import {
  GraduationCap, Users, Award, BookOpen,
  Calendar, Clock, TrendingUp, AlertTriangle,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import KPICard from '@/components/ui/KPICard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { mockPrograms, mockStudents, mockKPIs } from '@/lib/mock-data'
import { formatDate, timeAgo, cn } from '@/lib/utils'

export default function OperationsPage() {
  const totalStudents = mockPrograms.reduce((s, p) => s + p.studentsCount, 0)
  const pendingCerts = mockPrograms.reduce((s, p) => s + p.pendingCertificates, 0)
  const pendingMats = mockPrograms.reduce((s, p) => s + p.pendingMaterials, 0)

  return (
    <div>
      <Header title="Operaciones Académicas" subtitle="Programas, estudiantes y pendientes académicos" />
      <div className="p-6 space-y-6 animate-fade-in-up">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Programas activos" value={mockKPIs.activePrograms} icon={BookOpen} variant="accent"
            subtitle="En curso actualmente" />
          <KPICard title="Estudiantes inscritos" value={totalStudents} icon={Users} variant="default"
            subtitle="Total en programas activos" />
          <KPICard title="Certificados pendientes" value={pendingCerts} icon={Award}
            variant={pendingCerts > 5 ? 'warning' : 'default'} subtitle="Por emitir y enviar" />
          <KPICard title="Materiales pendientes" value={pendingMats} icon={BookOpen}
            variant={pendingMats > 3 ? 'warning' : 'default'} subtitle="Por preparar/enviar" />
        </div>

        {/* Programs Grid */}
        <div>
          <h2 className="text-xs font-semibold text-os-textDim uppercase tracking-wider mb-4">
            Programas ({mockPrograms.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockPrograms.map((program) => {
              const fillPct = (program.studentsCount / program.maxStudents) * 100
              const fillColor = fillPct >= 90 ? 'bg-os-warning' : fillPct >= 60 ? 'bg-os-accent' : 'bg-os-success'
              const alerts = program.pendingCertificates + program.pendingMaterials

              return (
                <div key={program.id}
                  className="bg-os-card border border-os-border rounded-2xl p-5 hover:border-os-borderLight transition-all hover:shadow-card">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-sm font-bold text-white leading-tight">{program.name}</p>
                      <p className="text-[11px] text-os-textDim mt-0.5">{program.category} · {program.instructor}</p>
                    </div>
                    <StatusBadge value={program.status} size="xs" />
                  </div>

                  {/* Enrollment fill bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-os-textDim">Cupos ocupados</span>
                      <span className="text-[11px] font-semibold text-white">
                        {program.studentsCount}/{program.maxStudents}
                      </span>
                    </div>
                    <div className="h-1.5 bg-os-border rounded-full">
                      <div className={cn('h-1.5 rounded-full transition-all', fillColor)}
                        style={{ width: `${fillPct}%` }} />
                    </div>
                  </div>

                  {/* Progress */}
                  {program.completionRate > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-os-textDim">Avance del programa</span>
                        <span className="text-[11px] font-semibold text-os-accent">{program.completionRate}%</span>
                      </div>
                      <div className="h-1.5 bg-os-border rounded-full">
                        <div className="h-1.5 rounded-full bg-os-accent"
                          style={{ width: `${program.completionRate}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-os-border">
                    <div>
                      <p className="text-[10px] text-os-textDim uppercase">Precio</p>
                      <p className="text-xs font-semibold text-white mt-0.5">
                        RD${program.price.toLocaleString()}
                      </p>
                    </div>
                    {program.nextClass && (
                      <div>
                        <p className="text-[10px] text-os-textDim uppercase">Próxima clase</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar size={10} className="text-os-accent" />
                          <p className="text-xs text-os-muted">{formatDate(program.nextClass)}</p>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-os-textDim uppercase">Inicio</p>
                      <p className="text-xs text-os-muted mt-0.5">{formatDate(program.startDate)}</p>
                    </div>
                    {program.endDate && (
                      <div>
                        <p className="text-[10px] text-os-textDim uppercase">Fin</p>
                        <p className="text-xs text-os-muted mt-0.5">{formatDate(program.endDate)}</p>
                      </div>
                    )}
                  </div>

                  {/* Pending alerts */}
                  {alerts > 0 && (
                    <div className="mt-3 pt-3 border-t border-os-border flex gap-3">
                      {program.pendingCertificates > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-os-warning">
                          <AlertTriangle size={10} />
                          {program.pendingCertificates} cert. pendiente{program.pendingCertificates > 1 ? 's' : ''}
                        </div>
                      )}
                      {program.pendingMaterials > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] text-os-warning">
                          <BookOpen size={10} />
                          {program.pendingMaterials} material{program.pendingMaterials > 1 ? 'es' : ''} pendiente{program.pendingMaterials > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Students Table */}
        <SectionCard
          title="Estudiantes Inscritos"
          subtitle={`${mockStudents.length} registros cargados`}
          icon={Users}
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-os-border">
                  {['Nombre', 'Programa', 'Inscripción', 'Progreso', 'Pago', 'Estado', 'Certificado'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-os-textDim uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border/50">
                {mockStudents.map((s) => (
                  <tr key={s.id} className="table-row-hover transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-white">{s.name}</p>
                      <p className="text-[11px] text-os-textDim">{s.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-os-muted max-w-[180px] truncate">{s.program}</td>
                    <td className="px-4 py-3 text-[11px] text-os-textDim">{formatDate(s.enrollmentDate)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-os-border rounded-full">
                          <div
                            className={cn(
                              'h-1.5 rounded-full',
                              s.progress >= 80 ? 'bg-os-success' : s.progress >= 40 ? 'bg-os-accent' : 'bg-os-muted'
                            )}
                            style={{ width: `${s.progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-os-muted">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={s.paymentStatus} size="xs" />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={s.status} size="xs" showDot />
                    </td>
                    <td className="px-4 py-3">
                      {s.pendingCertificate ? (
                        <span className="text-[11px] text-os-warning flex items-center gap-1">
                          <Clock size={10} /> Pendiente
                        </span>
                      ) : s.progress >= 100 ? (
                        <span className="text-[11px] text-os-success">Emitido</span>
                      ) : (
                        <span className="text-[11px] text-os-textDim">En curso</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

      </div>
    </div>
  )
}
