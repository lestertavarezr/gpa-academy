import {
  MessageCircle, Zap, Table, Monitor, Users, Mail,
  CheckCircle2, AlertTriangle, XCircle,
} from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'
import { useStore } from '@/lib/store'
import type { ModuleStatus } from '@/types'

const iconMap: Record<string, React.ElementType> = {
  MessageCircle, Zap, Table, Monitor, Users, Mail,
}

const statusConfig: Record<ModuleStatus, {
  icon: React.ElementType
  color: string
  bg: string
  label: string
}> = {
  operational: {
    icon: CheckCircle2,
    color: 'text-os-success',
    bg: 'bg-os-successDim',
    label: 'Operacional',
  },
  degraded: {
    icon: AlertTriangle,
    color: 'text-os-warning',
    bg: 'bg-os-warningDim',
    label: 'Degradado',
  },
  down: {
    icon: XCircle,
    color: 'text-os-danger',
    bg: 'bg-os-dangerDim',
    label: 'Caído',
  },
}

export default function SystemHealth() {
  const { state } = useStore()
  const mockSystemModules = state.systemModules
  const operational = mockSystemModules.filter(m => m.status === 'operational').length
  const total = mockSystemModules.length

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {(['operational', 'degraded', 'down'] as ModuleStatus[]).map(status => {
            const count = mockSystemModules.filter(m => m.status === status).length
            const config = statusConfig[status]
            return (
              <div key={status} className="flex items-center gap-1.5">
                <div className={cn('w-2 h-2 rounded-full', config.bg.replace('bg-', 'bg-').replace('/15', ''))} />
                <span className="text-[11px] text-os-textDim">
                  <span className={cn('font-semibold', config.color)}>{count}</span> {config.label.toLowerCase()}
                </span>
              </div>
            )
          })}
        </div>
        <span className="text-[11px] text-os-textDim">{operational}/{total} OK</span>
      </div>

      {/* Module list */}
      <div className="space-y-2">
        {mockSystemModules.map((module) => {
          const status = statusConfig[module.status]
          const StatusIcon = status.icon
          const ModuleIcon = iconMap[module.icon] || Monitor

          return (
            <div
              key={module.id}
              className="flex items-center gap-3 p-3 bg-os-surface border border-os-border rounded-xl hover:border-os-borderLight transition-all"
            >
              {/* Module icon */}
              <div className="w-8 h-8 bg-os-border rounded-lg flex items-center justify-center flex-shrink-0">
                <ModuleIcon size={14} className="text-os-muted" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white truncate">{module.name}</p>
                  <div className={cn('flex items-center gap-1 ml-2', status.color)}>
                    <StatusIcon size={12} />
                    <span className="text-[10px] font-medium hidden sm:block">{status.label}</span>
                  </div>
                </div>
                <p className="text-[11px] text-os-textDim mt-0.5 truncate">{module.description}</p>
              </div>

              {/* Uptime */}
              <div className="flex flex-col items-end flex-shrink-0 ml-2">
                <span className={cn('text-xs font-bold tabular-nums', status.color)}>
                  {module.uptime.toFixed(1)}%
                </span>
                <span className="text-[10px] text-os-textDim">{timeAgo(module.lastCheck)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
