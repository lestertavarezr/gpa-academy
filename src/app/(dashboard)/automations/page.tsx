'use client'

import { CheckCircle2, AlertTriangle, PauseCircle, Clock, RefreshCw, TrendingUp, Activity, Play, Pause } from 'lucide-react'
import Header from '@/components/layout/Header'
import KPICard from '@/components/ui/KPICard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { useStore } from '@/lib/store'
import { timeAgo, cn } from '@/lib/utils'

const typeColors: Record<string, string> = {
  WhatsApp:  'text-green-400  bg-green-500/10',
  N8N:       'text-yellow-400 bg-yellow-500/10',
  Sheets:    'text-blue-400   bg-blue-500/10',
  Email:     'text-purple-400 bg-purple-500/10',
  Formulario:'text-cyan-400   bg-cyan-500/10',
  CRM:       'text-orange-400 bg-orange-500/10',
}

const logStatusConfig = {
  success: { color: 'text-os-success', bg: 'bg-os-successDim', icon: CheckCircle2 },
  error:   { color: 'text-os-danger',  bg: 'bg-os-dangerDim',  icon: AlertTriangle },
  warning: { color: 'text-os-warning', bg: 'bg-os-warningDim', icon: AlertTriangle },
}

export default function AutomationsPage() {
  const { state, toggleAutomation, restartAutomation } = useStore()
  const { automations, automationLogs } = state

  const active   = automations.filter(a => a.status === 'activa').length
  const errors   = automations.filter(a => a.status === 'error').length
  const paused   = automations.filter(a => a.status === 'pausada').length
  const totalRuns = automations.reduce((s, a) => s + a.totalRuns, 0)
  const avgSuccess = (automations.reduce((s, a) => s + a.successRate, 0) / automations.length).toFixed(0)

  return (
    <div>
      <Header title="Automatizaciones" subtitle="Estado en tiempo real de workflows y agentes" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Activas"        value={active}         icon={CheckCircle2} variant="success" subtitle={`de ${automations.length} total`} />
          <KPICard title="Con errores"    value={errors}         icon={AlertTriangle} variant={errors > 0 ? 'danger' : 'default'} subtitle="Requieren atención" />
          <KPICard title="Pausadas"       value={paused}         icon={PauseCircle}  variant="warning" subtitle="Inactivas" />
          <KPICard title="Éxito promedio" value={`${avgSuccess}%`} icon={TrendingUp} variant="accent"  subtitle={`${totalRuns.toLocaleString()} ejecuciones`} />
        </div>

        <SectionCard title="Workflows y Agentes" subtitle="Estado detallado — interactúa con cada workflow" icon={Activity} noPadding>
          <div className="divide-y divide-os-border/50">
            {automations.map(auto => {
              const pct = auto.successRate
              const barColor = pct >= 90 ? 'bg-os-success' : pct >= 70 ? 'bg-os-warning' : 'bg-os-danger'
              const isActive = auto.status === 'activa'
              const isError  = auto.status === 'error'

              return (
                <div key={auto.id} className="px-5 py-4 hover:bg-os-border/20 transition-all">
                  <div className="flex items-start gap-4">
                    {/* Status dot */}
                    <div className={cn(
                      'mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0',
                      isActive ? 'bg-os-success pulse-dot' : isError ? 'bg-os-danger pulse-dot' : 'bg-os-warning'
                    )} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="text-sm font-semibold text-white">{auto.name}</p>
                          <p className="text-xs text-os-textDim mt-0.5">{auto.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', typeColors[auto.type] || 'text-os-muted bg-os-border')}>
                            {auto.type}
                          </span>
                          <StatusBadge value={auto.status} showDot size="xs" />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {auto.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-os-textDim bg-os-border px-1.5 py-0.5 rounded-md">#{tag}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        <div>
                          <p className="text-[10px] text-os-textDim uppercase tracking-wider mb-1">Última ejecución</p>
                          <p className="text-xs text-os-muted">{timeAgo(auto.lastRun)}</p>
                        </div>
                        {auto.nextRun && (
                          <div>
                            <p className="text-[10px] text-os-textDim uppercase tracking-wider mb-1">Próxima</p>
                            <div className="flex items-center gap-1 text-xs text-os-muted">
                              <Clock size={10} /> {timeAgo(auto.nextRun)}
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] text-os-textDim uppercase tracking-wider mb-1">Total runs</p>
                          <p className="text-xs font-semibold text-white">{auto.totalRuns.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-os-textDim uppercase tracking-wider mb-1">Tasa de éxito</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-os-border rounded-full">
                              <div className={cn('h-1.5 rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
                            </div>
                            <span className={cn('text-xs font-bold', pct >= 90 ? 'text-os-success' : pct >= 70 ? 'text-os-warning' : 'text-os-danger')}>{pct}%</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-os-textDim mt-2">
                        <span className="text-os-accent">⚡ Trigger:</span> {auto.trigger}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleAutomation(auto.id)}
                        title={isActive ? 'Pausar' : 'Activar'}
                        className={cn(
                          'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-medium',
                          isActive
                            ? 'border-os-warning/40 text-os-warning hover:bg-os-warningDim'
                            : 'border-os-success/40 text-os-success hover:bg-os-successDim'
                        )}
                      >
                        {isActive ? <><Pause size={12} /> Pausar</> : <><Play size={12} /> Activar</>}
                      </button>
                      {(isError || !isActive) && (
                        <button
                          onClick={() => restartAutomation(auto.id)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-os-accent/30 text-os-accent hover:bg-os-accentGlow transition-all font-medium"
                        >
                          <RefreshCw size={12} /> Reiniciar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>

        {/* Logs */}
        <SectionCard title="Logs Recientes" subtitle="Últimas ejecuciones" icon={Activity} noPadding>
          <div className="divide-y divide-os-border/50">
            {automationLogs.map(log => {
              const config = logStatusConfig[log.status]
              const Icon = config.icon
              return (
                <div key={log.id} className="flex items-start gap-3 px-5 py-3 hover:bg-os-border/20 transition-all">
                  <div className={cn('mt-0.5 p-1.5 rounded-lg flex-shrink-0', config.bg)}>
                    <Icon size={12} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-white">{log.automationName}</p>
                      <span className="text-[10px] text-os-textDim flex-shrink-0">{timeAgo(log.timestamp)}</span>
                    </div>
                    <p className="text-[11px] text-os-textDim mt-0.5 font-mono leading-relaxed">{log.message}</p>
                    {log.duration != null && (
                      <span className="text-[10px] text-os-textDim mt-0.5 block">
                        {log.duration >= 1000 ? `${(log.duration / 1000).toFixed(1)}s` : `${log.duration}ms`}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
