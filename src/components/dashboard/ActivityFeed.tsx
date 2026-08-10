import {
  UserPlus, MessageSquare, CheckSquare, Zap, AlertTriangle,
  DollarSign, GraduationCap, Award, Bell, Image, RefreshCw,
} from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'
import { useStore } from '@/lib/store'
import type { ActivityType } from '@/types'

const activityConfig: Record<ActivityType, {
  icon: React.ElementType
  color: string
  bg: string
}> = {
  lead_created: { icon: UserPlus, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  lead_updated: { icon: RefreshCw, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  message_sent: { icon: MessageSquare, color: 'text-green-400', bg: 'bg-green-500/10' },
  task_created: { icon: CheckSquare, color: 'text-os-accent', bg: 'bg-os-accentGlow' },
  task_completed: { icon: CheckSquare, color: 'text-os-success', bg: 'bg-os-successDim' },
  automation_run: { icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  automation_error: { icon: AlertTriangle, color: 'text-os-danger', bg: 'bg-os-dangerDim' },
  sale_closed: { icon: DollarSign, color: 'text-os-success', bg: 'bg-os-successDim' },
  student_enrolled: { icon: GraduationCap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  certificate_issued: { icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  alert_triggered: { icon: Bell, color: 'text-os-warning', bg: 'bg-os-warningDim' },
  content_published: { icon: Image, color: 'text-pink-400', bg: 'bg-pink-500/10' },
}

const sourceColors: Record<string, string> = {
  'Luz Bot': 'text-green-400',
  'N8N': 'text-yellow-400',
  'Manual': 'text-os-accent',
  'Sistema': 'text-os-textDim',
  'WhatsApp': 'text-green-400',
  'Formulario': 'text-blue-400',
}

interface ActivityFeedProps {
  limit?: number
  showTitle?: boolean
}

export default function ActivityFeed({ limit = 12, showTitle = false }: ActivityFeedProps) {
  const { state } = useStore()
  const events = state.activity.slice(0, limit)

  return (
    <div>
      {showTitle && (
        <h3 className="text-sm font-semibold text-white mb-4">Actividad Autónoma</h3>
      )}
      <div className="space-y-1">
        {events.map((event, idx) => {
          const config = activityConfig[event.type]
          const Icon = config.icon

          return (
            <div
              key={event.id}
              className={cn(
                'flex gap-3 p-3 rounded-xl hover:bg-os-border/50 transition-all duration-150 group animate-fade-in-up',
              )}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {/* Icon */}
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5', config.bg)}>
                <Icon size={14} className={config.color} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium text-white leading-snug">{event.title}</p>
                  <span className="text-[10px] text-os-textDim whitespace-nowrap flex-shrink-0">
                    {timeAgo(event.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-os-textDim mt-0.5 leading-relaxed line-clamp-2">
                  {event.description}
                </p>
                <span className={cn(
                  'text-[10px] font-medium mt-1 inline-block',
                  sourceColors[event.source] || 'text-os-textDim'
                )}>
                  via {event.source}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
