import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  noPadding?: boolean
}

export default function SectionCard({
  title,
  subtitle,
  icon: Icon,
  action,
  children,
  className,
  bodyClassName,
  noPadding = false,
}: SectionCardProps) {
  return (
    <div className={cn(
      'bg-os-card border border-os-border rounded-2xl overflow-hidden',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-os-border">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-1.5 bg-os-accentGlow rounded-lg">
              <Icon size={14} className="text-os-accent" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            {subtitle && <p className="text-[11px] text-os-textDim mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Body */}
      <div className={cn(!noPadding && 'p-5', bodyClassName)}>
        {children}
      </div>
    </div>
  )
}
