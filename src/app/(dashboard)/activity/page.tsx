'use client'

import { Activity, Bot, Zap, User, Server } from 'lucide-react'
import Header from '@/components/layout/Header'
import KPICard from '@/components/ui/KPICard'
import SectionCard from '@/components/ui/SectionCard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import { useStore } from '@/lib/store'

export default function ActivityPage() {
  const { state } = useStore()
  const { activity: mockActivity } = state

  const bySource = mockActivity.reduce<Record<string, number>>((acc, e) => {
    acc[e.source] = (acc[e.source] || 0) + 1
    return acc
  }, {})

  const automated = mockActivity.filter((e: { source: string }) =>
    ['Luz Bot', 'N8N', 'Sistema'].includes(e.source)
  ).length

  return (
    <div>
      <Header title="Autonomous Activity Feed" subtitle="Todo lo que el sistema hizo — logs de agentes y automatizaciones" />
      <div className="p-6 space-y-6 animate-fade-in-up">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Eventos totales" value={mockActivity.length} icon={Activity} variant="accent"
            subtitle="En la sesión actual" />
          <KPICard title="Acciones autónomas" value={automated} icon={Bot} variant="success"
            subtitle="Bot + N8N + Sistema" />
          <KPICard title="Acciones manuales" value={mockActivity.length - automated} icon={User} variant="default"
            subtitle="Por el equipo" />
          <KPICard title="Fuentes activas" value={Object.keys(bySource).length} icon={Server} variant="default"
            subtitle="Sistemas reportando" />
        </div>

        {/* Source breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(bySource).map(([source, count]) => (
            <div key={source} className="bg-os-card border border-os-border rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-white">{count}</p>
              <p className="text-[11px] text-os-textDim mt-1">{source}</p>
            </div>
          ))}
        </div>

        {/* Full feed */}
        <SectionCard
          title="Feed Completo"
          subtitle="Historial de todas las acciones del sistema"
          icon={Activity}
        >
          <ActivityFeed limit={100} />
        </SectionCard>

      </div>
    </div>
  )
}
