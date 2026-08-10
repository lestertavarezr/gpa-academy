import { cn } from '@/lib/utils'
import type { LeadStatus, AutomationStatus, TaskPriority, TaskStatus, ContentStatus, AlertSeverity, ModuleStatus, IntegrationStatus } from '@/types'

type BadgeValue =
  | LeadStatus
  | AutomationStatus
  | TaskPriority
  | TaskStatus
  | ContentStatus
  | AlertSeverity
  | ModuleStatus
  | IntegrationStatus
  | 'caliente' | 'tibio' | 'frio'
  | 'completado' | 'pendiente' | 'al_día' | 'atrasado'
  | 'activo' | 'próximo' | 'pausado'
  | string

const badgeConfig: Record<string, { label: string; className: string; dot?: string }> = {
  // Lead status
  nuevo: { label: 'Nuevo', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
  contactado: { label: 'Contactado', className: 'bg-purple-500/15 text-purple-400 border-purple-500/20', dot: 'bg-purple-400' },
  interesado: { label: 'Interesado', className: 'bg-os-accentGlow text-os-accent border-os-accent/20', dot: 'bg-os-accent' },
  pendiente: { label: 'Pendiente', className: 'bg-os-warningDim text-os-warning border-os-warning/20', dot: 'bg-os-warning' },
  cerrado: { label: 'Cerrado', className: 'bg-os-successDim text-os-success border-os-success/20', dot: 'bg-os-success' },
  perdido: { label: 'Perdido', className: 'bg-os-dangerDim text-os-danger border-os-danger/20', dot: 'bg-os-danger' },
  // Temperature
  caliente: { label: 'Caliente', className: 'bg-red-500/15 text-red-400 border-red-500/20', dot: 'bg-red-400' },
  tibio: { label: 'Tibio', className: 'bg-orange-500/15 text-orange-400 border-orange-500/20', dot: 'bg-orange-400' },
  frio: { label: 'Frío', className: 'bg-sky-500/15 text-sky-400 border-sky-500/20', dot: 'bg-sky-400' },
  // Automation
  activa: { label: 'Activa', className: 'bg-os-successDim text-os-success border-os-success/20', dot: 'bg-os-success' },
  pausada: { label: 'Pausada', className: 'bg-os-warningDim text-os-warning border-os-warning/20', dot: 'bg-os-warning' },
  error: { label: 'Error', className: 'bg-os-dangerDim text-os-danger border-os-danger/20', dot: 'bg-os-danger' },
  // Task priority
  baja: { label: 'Baja', className: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
  media: { label: 'Media', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  alta: { label: 'Alta', className: 'bg-os-warningDim text-os-warning border-os-warning/20' },
  crítica: { label: 'Crítica', className: 'bg-os-dangerDim text-os-danger border-os-danger/20' },
  // Task status
  en_progreso: { label: 'En progreso', className: 'bg-os-accentGlow text-os-accent border-os-accent/20', dot: 'bg-os-accent' },
  completada: { label: 'Completada', className: 'bg-os-successDim text-os-success border-os-success/20', dot: 'bg-os-success' },
  bloqueada: { label: 'Bloqueada', className: 'bg-os-dangerDim text-os-danger border-os-danger/20', dot: 'bg-os-danger' },
  // Content status
  idea: { label: 'Idea', className: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
  en_producción: { label: 'Producción', className: 'bg-os-accentGlow text-os-accent border-os-accent/20' },
  revisión: { label: 'Revisión', className: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  programado: { label: 'Programado', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  publicado: { label: 'Publicado', className: 'bg-os-successDim text-os-success border-os-success/20', dot: 'bg-os-success' },
  // Alert severity
  info: { label: 'Info', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  warning: { label: 'Advertencia', className: 'bg-os-warningDim text-os-warning border-os-warning/20' },
  critical: { label: 'Crítico', className: 'bg-os-dangerDim text-os-danger border-os-danger/20' },
  // System
  operational: { label: 'Operacional', className: 'bg-os-successDim text-os-success border-os-success/20', dot: 'bg-os-success' },
  degraded: { label: 'Degradado', className: 'bg-os-warningDim text-os-warning border-os-warning/20', dot: 'bg-os-warning' },
  down: { label: 'Caído', className: 'bg-os-dangerDim text-os-danger border-os-danger/20', dot: 'bg-os-danger' },
  // Integration
  connected: { label: 'Conectado', className: 'bg-os-successDim text-os-success border-os-success/20', dot: 'bg-os-success' },
  disconnected: { label: 'Desconectado', className: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
  // Programs
  activo: { label: 'Activo', className: 'bg-os-successDim text-os-success border-os-success/20', dot: 'bg-os-success' },
  próximo: { label: 'Próximo', className: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  completado: { label: 'Completado', className: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
  // Payment
  al_día: { label: 'Al día', className: 'bg-os-successDim text-os-success border-os-success/20' },
  atrasado: { label: 'Atrasado', className: 'bg-os-dangerDim text-os-danger border-os-danger/20' },
}

interface StatusBadgeProps {
  value: BadgeValue
  showDot?: boolean
  size?: 'xs' | 'sm'
  className?: string
}

export default function StatusBadge({ value, showDot = false, size = 'sm', className }: StatusBadgeProps) {
  const config = badgeConfig[value] || {
    label: value,
    className: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium border rounded-full whitespace-nowrap',
      size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5',
      config.className,
      className
    )}>
      {(showDot && config.dot) && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      )}
      {config.label}
    </span>
  )
}
