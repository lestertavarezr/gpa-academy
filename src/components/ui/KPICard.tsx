import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variants = {
  default: {
    card: 'border-os-border',
    icon: 'bg-os-border text-os-muted',
    value: 'text-white',
    glow: '',
  },
  accent: {
    card: 'border-os-accent/30',
    icon: 'bg-os-accentGlow text-os-accent',
    value: 'text-os-accent',
    glow: 'shadow-glow-accent',
  },
  success: {
    card: 'border-os-success/30',
    icon: 'bg-os-successDim text-os-success',
    value: 'text-os-success',
    glow: 'shadow-glow-success',
  },
  warning: {
    card: 'border-os-warning/30',
    icon: 'bg-os-warningDim text-os-warning',
    value: 'text-os-warning',
    glow: '',
  },
  danger: {
    card: 'border-os-danger/30',
    icon: 'bg-os-dangerDim text-os-danger',
    value: 'text-os-danger',
    glow: 'shadow-glow-danger',
  },
}

const trendColors = {
  up: 'text-os-success',
  down: 'text-os-danger',
  neutral: 'text-os-textDim',
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  size = 'md',
  className,
}: KPICardProps) {
  const v = variants[variant]
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus

  return (
    <div className={cn(
      'relative bg-os-card border rounded-2xl p-5 transition-all duration-200 hover:border-opacity-60 group',
      v.card,
      v.glow,
      className
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-5 bg-current" />
      </div>

      <div className="relative">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className={cn('p-2.5 rounded-xl', v.icon)}>
            <Icon size={18} />
          </div>
          {trend && (
            <div className={cn('flex items-center gap-1 text-xs font-medium', trendColors[trend.direction])}>
              <TrendIcon size={12} />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className={cn(
          'font-bold tabular-nums mb-0.5',
          v.value,
          size === 'sm' ? 'text-2xl' : size === 'lg' ? 'text-4xl' : 'text-3xl'
        )}>
          {value}
        </div>

        {/* Title */}
        <p className="text-xs font-medium text-os-muted leading-tight">{title}</p>

        {/* Subtitle/trend label */}
        {(subtitle || trend?.label) && (
          <p className={cn(
            'text-[11px] mt-1',
            trend ? trendColors[trend.direction] : 'text-os-textDim'
          )}>
            {trend?.label || subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
