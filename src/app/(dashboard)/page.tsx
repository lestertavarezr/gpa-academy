'use client'

import {
  Users, MessageCircle, DollarSign, TrendingUp,
  CheckSquare, Zap, AlertTriangle, GraduationCap,
  Award, Activity, Shield, ArrowRight, Bell,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import KPICard from '@/components/ui/KPICard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import SystemHealth from '@/components/dashboard/SystemHealth'
import SalesChart from '@/components/charts/SalesChart'
import FunnelChart from '@/components/charts/FunnelChart'
import LeadSourceChart from '@/components/charts/LeadSourceChart'
import { useStore } from '@/lib/store'
import { formatCurrencyShort, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default function CEODashboard() {
  const { state, resolveAlert } = useStore()
  const { leads, tasks, alerts, sales, kpis } = state

  const criticalAlerts = alerts.filter(a => !a.resolved && a.severity === 'critical')
  const urgentTasks    = tasks.filter(t => (t.priority === 'crítica' || t.priority === 'alta') && t.status !== 'completada')
  const recentSales    = sales.slice(0, 4)
  const openAlerts     = alerts.filter(a => !a.resolved)

  return (
    <div>
      <Header title="CEO View" subtitle="GPA Academy OS — Vista ejecutiva en tiempo real" />
      <div className="p-6 space-y-6">

        {/* Critical Alert Banner */}
        {criticalAlerts.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-os-dangerDim border border-os-danger/30 rounded-2xl animate-fade-in-up">
            <div className="p-2 bg-os-danger/20 rounded-lg">
              <AlertTriangle size={18} className="text-os-danger" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                {criticalAlerts.length} alerta{criticalAlerts.length > 1 ? 's' : ''} crítica{criticalAlerts.length > 1 ? 's' : ''} requiere{criticalAlerts.length === 1 ? '' : 'n'} atención
              </p>
              <p className="text-xs text-os-muted mt-0.5">{criticalAlerts[0].title}</p>
            </div>
            <button
              onClick={() => resolveAlert(criticalAlerts[0].id)}
              className="text-xs font-semibold text-os-danger hover:text-red-300 border border-os-danger/30 px-3 py-1.5 rounded-lg transition-all hover:bg-os-danger/10"
            >
              Resolver
            </button>
            <Link href="/alerts" className="flex items-center gap-1 text-xs font-semibold text-os-muted hover:text-white transition-colors">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>
        )}

        {/* KPI Grid */}
        <div>
          <h2 className="text-xs font-semibold text-os-textDim uppercase tracking-wider mb-3">Indicadores Clave</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPICard title="Leads este mes"        value={kpis.leadsMonth}                          icon={Users}          variant="accent"  trend={{ value: 17, label: '+17 vs anterior', direction: 'up' }} />
            <KPICard title="Conversaciones activas" value={kpis.activeConversations}                icon={MessageCircle}  variant="default" subtitle="Bot Luz activo" />
            <KPICard title="Ventas del mes"         value={kpis.salesMonth}                          icon={TrendingUp}     variant="success" trend={{ value: 12, label: 'vs mes anterior', direction: 'up' }} />
            <KPICard title="Ingresos del mes"       value={formatCurrencyShort(kpis.salesMonthAmount)} icon={DollarSign}   variant="success" trend={{ value: 8, label: '+RD$15K vs anterior', direction: 'up' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Estudiantes"         value={kpis.totalStudents}      icon={GraduationCap} variant="default" subtitle={`${kpis.activePrograms} programas activos`} />
          <KPICard title="Tareas pendientes"   value={kpis.pendingTasks}       icon={CheckSquare}   variant={kpis.criticalTasks > 0 ? 'warning' : 'default'} subtitle={`${kpis.criticalTasks} críticas`} />
          <KPICard title="Automatizaciones"    value={kpis.activeAutomations}  icon={Zap}           variant={kpis.automationErrors > 0 ? 'warning' : 'success'} subtitle={kpis.automationErrors > 0 ? `${kpis.automationErrors} con error` : 'Todo activo'} />
          <KPICard title="Certificados pend."  value={kpis.pendingCertificates} icon={Award}        variant={kpis.pendingCertificates > 5 ? 'warning' : 'default'} subtitle="Por emitir" />
        </div>

        {/* System Health + Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <SectionCard title="System Health" subtitle="Estado de módulos" icon={Shield}
            action={<span className="text-[11px] text-os-success font-semibold bg-os-successDim px-2 py-1 rounded-full">{kpis.systemHealth}% uptime</span>}>
            <SystemHealth />
          </SectionCard>
          <div className="xl:col-span-2">
            <SectionCard title="Autonomous Activity Feed" subtitle="Acciones recientes del sistema" icon={Activity}
              action={<Link href="/activity" className="text-xs text-os-accent hover:text-purple-300 flex items-center gap-1">Ver todo <ArrowRight size={11} /></Link>}
              noPadding>
              <div className="p-4 max-h-[380px] overflow-y-auto">
                <ActivityFeed limit={8} />
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2">
            <SectionCard title="Ventas e Ingresos" subtitle="Historial mensual" icon={TrendingUp}>
              <SalesChart />
            </SectionCard>
          </div>
          <SectionCard title="Embudo de Conversión" subtitle="Este mes" icon={Users}>
            <FunnelChart />
          </SectionCard>
        </div>

        {/* Recent Sales + Tasks + Lead Sources */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <SectionCard title="Últimas Ventas" icon={DollarSign}
            action={<Link href="/leads" className="text-xs text-os-accent flex items-center gap-1">Ver todas <ArrowRight size={11} /></Link>}
            noPadding>
            <div className="divide-y divide-os-border">
              {recentSales.map(sale => (
                <div key={sale.id} className="flex items-center justify-between px-5 py-3 hover:bg-os-border/30 transition-all">
                  <div>
                    <p className="text-xs font-medium text-white">{sale.leadName}</p>
                    <p className="text-[11px] text-os-textDim mt-0.5 truncate max-w-[140px]">{sale.program}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-os-success">RD${sale.amount.toLocaleString()}</p>
                    <StatusBadge value={sale.status} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Tareas Urgentes" icon={CheckSquare}
            action={<Link href="/tasks" className="text-xs text-os-accent flex items-center gap-1">Centro de control <ArrowRight size={11} /></Link>}
            noPadding>
            <div className="divide-y divide-os-border">
              {urgentTasks.slice(0, 4).map(task => (
                <div key={task.id} className="flex items-start gap-3 px-5 py-3 hover:bg-os-border/30 transition-all">
                  <StatusBadge value={task.priority} size="xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white leading-snug line-clamp-2">{task.title}</p>
                    <p className="text-[11px] text-os-textDim mt-0.5">{task.category}</p>
                  </div>
                </div>
              ))}
              {urgentTasks.length === 0 && (
                <div className="px-5 py-6 text-center text-xs text-os-textDim">Sin tareas críticas pendientes ✓</div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Fuentes de Leads" subtitle="Este mes" icon={Users}>
            <LeadSourceChart />
          </SectionCard>
        </div>

        {/* Alerts summary */}
        {openAlerts.length > 0 && (
          <SectionCard title="Alertas Activas" subtitle={`${openAlerts.length} sin resolver`} icon={Bell}
            action={<Link href="/alerts" className="text-xs text-os-accent flex items-center gap-1">Gestionar <ArrowRight size={11} /></Link>}
            noPadding>
            <div className="divide-y divide-os-border">
              {openAlerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 px-5 py-3 hover:bg-os-border/30 transition-all">
                  <div className={`mt-0.5 p-1 rounded-lg flex-shrink-0 ${alert.severity === 'critical' ? 'bg-os-dangerDim' : alert.severity === 'warning' ? 'bg-os-warningDim' : 'bg-blue-500/10'}`}>
                    <AlertTriangle size={12} className={alert.severity === 'critical' ? 'text-os-danger' : alert.severity === 'warning' ? 'text-os-warning' : 'text-blue-400'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white">{alert.title}</p>
                    <p className="text-[11px] text-os-textDim mt-0.5 line-clamp-1">{alert.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={alert.severity} size="xs" className="flex-shrink-0" />
                    <button onClick={() => resolveAlert(alert.id)}
                      className="text-[11px] text-os-textDim hover:text-os-success border border-os-border hover:border-os-success/40 px-2 py-0.5 rounded-lg transition-all">
                      Resolver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
