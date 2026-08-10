'use client'

import { AlertTriangle, CheckCircle2, XCircle, Info, Zap, Clock, DollarSign, Users, Shield } from 'lucide-react'
import Header from '@/components/layout/Header'
import KPICard from '@/components/ui/KPICard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { useStore } from '@/lib/store'
import { timeAgo, cn } from '@/lib/utils'
import type { AlertType } from '@/types'

const typeConfig: Record<AlertType, { icon: React.ElementType; label: string }> = {
  automation_error:    { icon: Zap,           label: 'Error de automatización' },
  follow_up_delayed:  { icon: Users,          label: 'Seguimiento retrasado'   },
  integration_failure:{ icon: Shield,         label: 'Fallo de integración'    },
  system:             { icon: Shield,         label: 'Sistema'                 },
  lead:               { icon: Users,          label: 'Lead'                    },
  payment:            { icon: DollarSign,     label: 'Pago'                    },
}

const severityConfig = {
  critical: { border: 'border-os-danger/40',  bg: 'bg-os-dangerDim',  iconColor: 'text-os-danger',  icon: XCircle,       glow: 'shadow-glow-danger' },
  warning:  { border: 'border-os-warning/40', bg: 'bg-os-warningDim', iconColor: 'text-os-warning', icon: AlertTriangle, glow: '' },
  info:     { border: 'border-blue-500/30',   bg: 'bg-blue-500/10',   iconColor: 'text-blue-400',   icon: Info,          glow: '' },
}

export default function AlertsPage() {
  const { state, resolveAlert } = useStore()
  const { alerts } = state

  const open     = alerts.filter(a => !a.resolved)
  const critical = alerts.filter(a => a.severity === 'critical' && !a.resolved)
  const warnings = alerts.filter(a => a.severity === 'warning'  && !a.resolved)
  const resolved = alerts.filter(a =>  a.resolved)

  return (
    <div>
      <Header title="Alertas & Incidencias" subtitle="Errores, retrasos y fallos del sistema" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Alertas abiertas" value={open.length}     icon={AlertTriangle} variant={open.length > 0 ? 'danger' : 'success'} subtitle="Sin resolver" />
          <KPICard title="Críticas"         value={critical.length} icon={XCircle}       variant={critical.length > 0 ? 'danger' : 'default'} subtitle="Atención inmediata" />
          <KPICard title="Advertencias"     value={warnings.length} icon={AlertTriangle} variant={warnings.length > 0 ? 'warning' : 'default'} subtitle="Monitorear" />
          <KPICard title="Resueltas"        value={resolved.length} icon={CheckCircle2}  variant="success" subtitle="Cerradas exitosamente" />
        </div>

        {/* Open Alerts */}
        {open.length > 0 ? (
          <div>
            <h2 className="text-xs font-semibold text-os-textDim uppercase tracking-wider mb-4">Alertas Activas ({open.length})</h2>
            <div className="space-y-3">
              {open.map((alert, idx) => {
                const severity = severityConfig[alert.severity]
                const SeverityIcon = severity.icon
                const type = typeConfig[alert.type]
                const TypeIcon = type.icon

                return (
                  <div key={alert.id}
                    className={cn('bg-os-card border rounded-2xl p-5 animate-fade-in-up', severity.border, severity.glow)}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn('p-2.5 rounded-xl flex-shrink-0', severity.bg)}>
                        <SeverityIcon size={18} className={severity.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-white">{alert.title}</p>
                            <p className="text-xs text-os-muted mt-1 leading-relaxed">{alert.description}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <StatusBadge value={alert.severity} size="xs" />
                            <button
                              onClick={() => resolveAlert(alert.id)}
                              className="text-xs text-os-success hover:text-green-300 border border-os-success/30 px-3 py-1 rounded-lg transition-all hover:bg-os-successDim font-semibold"
                            >
                              ✓ Resolver
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <span className="flex items-center gap-1.5 text-[11px] text-os-textDim"><TypeIcon size={11} />{type.label}</span>
                          <span className="flex items-center gap-1.5 text-[11px] text-os-textDim"><Shield size={11} />{alert.source}</span>
                          <span className="flex items-center gap-1.5 text-[11px] text-os-textDim"><Clock size={11} />{timeAgo(alert.timestamp)}</span>
                        </div>
                        {alert.actionRequired && (
                          <div className={cn('mt-3 p-3 rounded-xl text-xs', severity.bg)}>
                            <span className="font-semibold text-white">Acción requerida: </span>
                            <span className="text-os-muted">{alert.actionRequired}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-os-card border border-os-border rounded-2xl">
            <CheckCircle2 size={40} className="text-os-success mb-3" />
            <p className="text-sm font-semibold text-white">Sin alertas activas</p>
            <p className="text-xs text-os-textDim mt-1">Todos los sistemas funcionando correctamente</p>
          </div>
        )}

        {/* Resolved */}
        {resolved.length > 0 && (
          <SectionCard title="Alertas Resueltas" subtitle="Historial cerrado" icon={CheckCircle2} noPadding>
            <div className="divide-y divide-os-border/50">
              {resolved.map(alert => {
                const type = typeConfig[alert.type]
                const TypeIcon = type.icon
                return (
                  <div key={alert.id} className="flex items-center gap-3 px-5 py-3 opacity-60 hover:opacity-100 transition-all">
                    <CheckCircle2 size={14} className="text-os-success flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white">{alert.title}</p>
                      <p className="text-[11px] text-os-textDim">{type.label} · {timeAgo(alert.timestamp)}</p>
                    </div>
                    <span className="text-[11px] text-os-success flex-shrink-0">Resuelta ✓</span>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
