'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Zap, GraduationCap,
  Megaphone, CheckSquare, AlertTriangle, Settings,
  Activity, Shield, ChevronRight, Circle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'

const badgeColors: Record<string, string> = {
  danger:  'bg-os-danger  text-white',
  warning: 'bg-os-warning text-black',
  accent:  'bg-os-accent  text-white',
  success: 'bg-os-success text-white',
}

export default function Sidebar() {
  const pathname = usePathname()
  const { state } = useStore()

  const openAlerts    = state.alerts.filter(a => !a.resolved).length
  const criticalAlerts = state.alerts.filter(a => !a.resolved && a.severity === 'critical').length
  const pendingLeads  = state.leads.filter(l => l.status === 'nuevo').length
  const pendingTasks  = state.tasks.filter(t => t.status !== 'completada').length
  const autoErrors    = state.automations.filter(a => a.status === 'error').length
  const pendingCerts  = state.programs.reduce((s, p) => s + p.pendingCertificates, 0)
  const systemHealth  = state.kpis.systemHealth

  const navItems = [
    {
      group: 'PRINCIPAL',
      items: [
        { href: '/',        icon: LayoutDashboard, label: 'CEO View',        badge: null,         badgeType: 'accent' },
        { href: '/alerts',  icon: AlertTriangle,   label: 'Alertas',         badge: openAlerts || null, badgeType: criticalAlerts > 0 ? 'danger' : 'warning' },
      ],
    },
    {
      group: 'COMERCIAL',
      items: [
        { href: '/leads', icon: Users, label: 'Leads & Ventas', badge: pendingLeads || null, badgeType: 'accent' },
      ],
    },
    {
      group: 'OPERACIONES',
      items: [
        { href: '/automations', icon: Zap,         label: 'Automatizaciones', badge: autoErrors || null,  badgeType: 'danger'  },
        { href: '/operations',  icon: GraduationCap,label: 'Operaciones',     badge: pendingCerts || null, badgeType: 'warning' },
        { href: '/tasks',       icon: CheckSquare, label: 'Tareas',           badge: pendingTasks || null, badgeType: 'warning' },
      ],
    },
    {
      group: 'MARKETING',
      items: [
        { href: '/content', icon: Megaphone, label: 'Contenido', badge: null, badgeType: 'accent' },
      ],
    },
    {
      group: 'SISTEMA',
      items: [
        { href: '/activity', icon: Activity,  label: 'Activity Feed',  badge: null, badgeType: 'accent' },
        { href: '/settings', icon: Settings,  label: 'Integraciones',  badge: null, badgeType: 'accent' },
      ],
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col bg-os-surface border-r border-os-border z-40 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-os-border">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-os-accent to-[#006B73] flex items-center justify-center shadow-glow-accent">
            <Shield size={16} className="text-[#050B16]" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-os-success rounded-full border-2 border-os-surface pulse-dot" />
        </div>
        <div>
          <p className="font-display text-sm font-normal text-os-text tracking-wide">GPA Academy</p>
          <p className="font-tech text-os-accent" style={{ fontSize: '0.6rem' }}>OS v1.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6">
        {navItems.map((group) => (
          <div key={group.group}>
            <p className="font-tech px-2 mb-2 text-os-textDim">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                        isActive
                          ? 'sidebar-active text-white'
                          : 'text-os-muted hover:text-white hover:bg-os-border'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={16} className={cn(isActive ? 'text-os-accent' : 'text-os-textDim group-hover:text-os-muted')} />
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.badge !== null && item.badge !== undefined && (
                          <span className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                            badgeColors[item.badgeType || 'accent']
                          )}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight size={12} className="text-os-accent ml-1 opacity-60" />}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="px-4 py-4 border-t border-os-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-os-textDim uppercase tracking-wider font-medium">Estado del Sistema</span>
          <span className={cn(
            'text-[10px] font-semibold',
            systemHealth >= 95 ? 'text-os-success' : systemHealth >= 80 ? 'text-os-warning' : 'text-os-danger'
          )}>{systemHealth}%</span>
        </div>
        <div className="w-full bg-os-border rounded-full h-1.5">
          <div
            className={cn(
              'h-1.5 rounded-full transition-all duration-500',
              systemHealth >= 95 ? 'bg-gradient-to-r from-os-success to-os-accent' :
              systemHealth >= 80 ? 'bg-os-warning' : 'bg-os-danger'
            )}
            style={{ width: `${systemHealth}%` }}
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Circle size={6} className="text-os-success fill-os-success" />
          <span className="text-[10px] text-os-textDim">
            {state.systemModules.filter(m => m.status === 'operational').length} módulos activos
          </span>
          {autoErrors > 0
            ? <span className="ml-auto text-[10px] text-os-danger font-medium">{autoErrors} error{autoErrors > 1 ? 'es' : ''}</span>
            : <span className="ml-auto text-[10px] text-os-success font-medium">Todo OK</span>
          }
        </div>
      </div>
    </aside>
  )
}
