'use client'

import {
  Megaphone, Eye, MousePointerClick, TrendingUp,
  Heart, Calendar, Image, Mail, Video,
  Filter,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import KPICard from '@/components/ui/KPICard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { mockContent } from '@/lib/mock-data'
import { formatDate, cn } from '@/lib/utils'
import type { ContentType, ContentPlatform } from '@/types'

const typeIcons: Record<ContentType, React.ElementType> = {
  Reel: Video,
  Post: Image,
  Historia: Image,
  Email: Mail,
  Blog: Megaphone,
  Anuncio: TrendingUp,
}

const platformColors: Record<ContentPlatform, string> = {
  Instagram: 'text-pink-400 bg-pink-500/10',
  TikTok: 'text-cyan-400 bg-cyan-500/10',
  Facebook: 'text-blue-400 bg-blue-500/10',
  Email: 'text-purple-400 bg-purple-500/10',
  YouTube: 'text-red-400 bg-red-500/10',
  WhatsApp: 'text-green-400 bg-green-500/10',
}

export default function ContentPage() {
  const published = mockContent.filter(c => c.status === 'publicado')
  const totalViews = published.reduce((s, c) => s + (c.metrics?.views || 0), 0)
  const totalClicks = published.reduce((s, c) => s + (c.metrics?.clicks || 0), 0)
  const totalConversions = published.reduce((s, c) => s + (c.metrics?.conversions || 0), 0)
  const avgEngagement = published.length > 0
    ? (published.reduce((s, c) => s + (c.metrics?.engagement || 0), 0) / published.length).toFixed(1)
    : '0'

  const statusOrder: Record<string, number> = {
    programado: 0, en_producción: 1, revisión: 2, idea: 3, publicado: 4,
  }
  const sorted = [...mockContent].sort((a, b) =>
    (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9)
  )

  // Group by status for calendar-like view
  const groups: Record<string, typeof mockContent> = {}
  mockContent.forEach(item => {
    const key = item.status
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })

  return (
    <div>
      <Header title="Contenido & Marketing" subtitle="Producción, calendario y métricas de contenido" />
      <div className="p-6 space-y-6 animate-fade-in-up">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Vistas totales" value={totalViews.toLocaleString()} icon={Eye} variant="accent"
            subtitle="Contenido publicado" />
          <KPICard title="Clics totales" value={totalClicks.toLocaleString()} icon={MousePointerClick} variant="default"
            subtitle="CTR del contenido" />
          <KPICard title="Conversiones" value={totalConversions} icon={TrendingUp} variant="success"
            subtitle="Leads generados" />
          <KPICard title="Engagement prom." value={`${avgEngagement}%`} icon={Heart} variant="default"
            subtitle="Promedio publicaciones" />
        </div>

        {/* Status pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(['idea', 'en_producción', 'revisión', 'programado', 'publicado'] as const).map(status => {
            const count = mockContent.filter(c => c.status === status).length
            return (
              <div key={status} className="bg-os-card border border-os-border rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{count}</div>
                <StatusBadge value={status} size="xs" />
              </div>
            )
          })}
        </div>

        {/* Content list */}
        <SectionCard
          title="Contenido"
          subtitle={`${mockContent.length} piezas en el pipeline`}
          icon={Megaphone}
          action={
            <button className="flex items-center gap-1.5 text-xs text-os-muted hover:text-white border border-os-border px-3 py-1.5 rounded-lg hover:border-os-accent transition-all">
              <Filter size={12} /> Filtrar
            </button>
          }
          noPadding
        >
          <div className="divide-y divide-os-border/50">
            {sorted.map((item) => {
              const Icon = typeIcons[item.type] || Megaphone
              const platformStyle = platformColors[item.platform] || 'text-os-muted bg-os-border'

              return (
                <div key={item.id} className="flex items-start gap-4 px-5 py-4 hover:bg-os-border/20 transition-all">
                  {/* Type icon */}
                  <div className="w-9 h-9 bg-os-border rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={15} className="text-os-muted" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-snug">{item.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', platformStyle)}>
                        {item.platform}
                      </span>
                      <span className="text-[11px] text-os-textDim">{item.type}</span>
                      {item.assignedTo && (
                        <span className="text-[11px] text-os-textDim">→ {item.assignedTo}</span>
                      )}
                      {item.scheduledDate && (
                        <span className="flex items-center gap-1 text-[11px] text-os-accent">
                          <Calendar size={10} /> {formatDate(item.scheduledDate)}
                        </span>
                      )}
                      {item.publishedDate && (
                        <span className="flex items-center gap-1 text-[11px] text-os-success">
                          ✓ Publicado {formatDate(item.publishedDate)}
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-os-textDim mt-1 italic">{item.notes}</p>
                    )}
                    {/* Metrics */}
                    {item.metrics && item.metrics.views > 0 && (
                      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-os-border/50">
                        <span className="flex items-center gap-1 text-[11px] text-os-muted">
                          <Eye size={10} /> {item.metrics.views.toLocaleString()} vistas
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-os-muted">
                          <MousePointerClick size={10} /> {item.metrics.clicks} clics
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-os-success">
                          <TrendingUp size={10} /> {item.metrics.conversions} conv.
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-pink-400">
                          <Heart size={10} /> {item.metrics.engagement}% eng.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <StatusBadge value={item.status} size="xs" className="flex-shrink-0 mt-1" />
                </div>
              )
            })}
          </div>
        </SectionCard>

      </div>
    </div>
  )
}
