'use client'

import { useState } from 'react'
import { Users, TrendingUp, DollarSign, Phone, Clock, UserCheck, Filter, X } from 'lucide-react'
import Header from '@/components/layout/Header'
import KPICard from '@/components/ui/KPICard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import FunnelChart from '@/components/charts/FunnelChart'
import LeadSourceChart from '@/components/charts/LeadSourceChart'
import { useStore } from '@/lib/store'
import { formatDate, formatCurrency, timeAgo } from '@/lib/utils'
import type { LeadStatus } from '@/types'

const sourceIcons: Record<string, string> = {
  Instagram: '📸', WhatsApp: '💬', Formulario: '📋', Referido: '🤝', Web: '🌐', Otro: '📌',
}

const statusOptions: LeadStatus[] = ['nuevo', 'contactado', 'interesado', 'pendiente', 'cerrado', 'perdido']

export default function LeadsPage() {
  const { state, updateLeadStatus } = useStore()
  const { leads, sales, kpis } = state

  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'todos'>('todos')
  const [filterTemp,   setFilterTemp]   = useState<'todos' | 'caliente' | 'tibio' | 'frio'>('todos')

  const filtered = leads
    .filter(l => filterStatus === 'todos' || l.status === filterStatus)
    .filter(l => filterTemp   === 'todos' || l.temperature === filterTemp)

  const hot       = leads.filter(l => l.temperature === 'caliente').length
  const closed    = leads.filter(l => l.status === 'cerrado').length
  const totalValue = leads.reduce((s, l) => s + (l.value || 0), 0)

  return (
    <div>
      <Header title="Leads & Ventas" subtitle="CRM — captación, seguimiento y cierre" />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Total leads (mes)"  value={kpis.leadsMonth} icon={Users}      variant="accent"  trend={{ value: 17, label: 'vs mes anterior', direction: 'up' }} />
          <KPICard title="Leads calientes"    value={hot}             icon={UserCheck}  variant="warning" subtitle="Requieren seguimiento" />
          <KPICard title="Cerrados (mes)"     value={closed}          icon={TrendingUp} variant="success" trend={{ value: 12, label: `${((closed / kpis.leadsMonth) * 100).toFixed(0)}% tasa cierre`, direction: 'up' }} />
          <KPICard title="Pipeline total"     value={`RD$${(totalValue / 1000).toFixed(0)}K`} icon={DollarSign} variant="default" subtitle="Valor potencial" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard title="Embudo de Conversión" subtitle="Octubre 2026" icon={TrendingUp}><FunnelChart /></SectionCard>
          <SectionCard title="Fuente de Leads" subtitle="Este mes" icon={Users}><LeadSourceChart /></SectionCard>
        </div>

        {/* Leads Table */}
        <SectionCard
          title="Tabla de Leads"
          subtitle={`${filtered.length} de ${leads.length} leads`}
          icon={Users}
          action={
            <div className="flex items-center gap-2">
              <select value={filterTemp} onChange={e => setFilterTemp(e.target.value as typeof filterTemp)}
                className="text-xs bg-os-border border border-os-borderLight text-os-muted rounded-lg px-2 py-1.5 outline-none focus:border-os-accent cursor-pointer">
                <option value="todos">Toda temperatura</option>
                <option value="caliente">Caliente 🔥</option>
                <option value="tibio">Tibio 🌡</option>
                <option value="frio">Frío ❄️</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
                className="text-xs bg-os-border border border-os-borderLight text-os-muted rounded-lg px-2 py-1.5 outline-none focus:border-os-accent cursor-pointer">
                <option value="todos">Todos los estados</option>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {(filterStatus !== 'todos' || filterTemp !== 'todos') && (
                <button onClick={() => { setFilterStatus('todos'); setFilterTemp('todos') }}
                  className="text-xs text-os-accent border border-os-accent/30 px-2 py-1.5 rounded-lg hover:bg-os-accentGlow transition-all">
                  <X size={11} />
                </button>
              )}
            </div>
          }
          noPadding
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-os-border">
                  {['Nombre', 'Programa', 'Fuente', 'Temp.', 'Estado', 'Último contacto', 'Follow-up', 'Valor'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-os-textDim uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border/50">
                {filtered.map(lead => (
                  <tr key={lead.id} className="table-row-hover transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-white">{lead.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone size={10} className="text-os-textDim" />
                        <span className="text-[11px] text-os-textDim">{lead.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-os-muted max-w-[160px]">
                      <span className="line-clamp-2">{lead.program || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      {sourceIcons[lead.source]} {lead.source}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={lead.temperature} showDot size="xs" />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={e => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="text-[11px] bg-os-border border border-os-borderLight text-os-muted rounded-lg px-1.5 py-1 outline-none focus:border-os-accent cursor-pointer transition-all hover:border-os-accent"
                      >
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-os-textDim whitespace-nowrap">{timeAgo(lead.lastContact)}</td>
                    <td className="px-4 py-3">
                      {lead.followUpDate ? (
                        <div className="flex items-center gap-1 text-[11px] text-os-warning">
                          <Clock size={10} /> {formatDate(lead.followUpDate)}
                        </div>
                      ) : <span className="text-[11px] text-os-textDim">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-os-success whitespace-nowrap">
                      {lead.value ? formatCurrency(lead.value) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-os-textDim">Sin leads con ese filtro</div>
            )}
          </div>
        </SectionCard>

        {/* Sales */}
        <SectionCard title="Historial de Pagos" subtitle="Ventas registradas" icon={DollarSign} noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-os-border">
                  {['Estudiante', 'Programa', 'Monto', 'Fecha', 'Método', 'Estado'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-os-textDim uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-os-border/50">
                {sales.map(sale => (
                  <tr key={sale.id} className="table-row-hover transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-white">{sale.leadName}</td>
                    <td className="px-4 py-3 text-xs text-os-muted">{sale.program}</td>
                    <td className="px-4 py-3 text-xs font-bold text-os-success">RD${sale.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-[11px] text-os-textDim">{formatDate(sale.date)}</td>
                    <td className="px-4 py-3 text-xs text-os-muted">{sale.paymentMethod}</td>
                    <td className="px-4 py-3"><StatusBadge value={sale.status} size="xs" /></td>
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
