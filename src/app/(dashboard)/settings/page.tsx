'use client'

import {
  Settings, MessageCircle, Zap, Table, Mail,
  FileText, Database, HardDrive, Instagram,
  CheckCircle2, XCircle, Clock, AlertTriangle,
  ExternalLink, ChevronRight,
} from 'lucide-react'
import Header from '@/components/layout/Header'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { mockIntegrations } from '@/lib/mock-data'
import { timeAgo, cn } from '@/lib/utils'
import type { IntegrationStatus } from '@/types'

const iconMap: Record<string, React.ElementType> = {
  MessageCircle, Zap, Table, Mail, FileText,
  Database, HardDrive, Instagram,
}

const statusConfig: Record<IntegrationStatus, {
  icon: React.ElementType
  color: string
  bg: string
}> = {
  connected: { icon: CheckCircle2, color: 'text-os-success', bg: 'bg-os-successDim' },
  disconnected: { icon: XCircle, color: 'text-os-textDim', bg: 'bg-os-border' },
  pending: { icon: Clock, color: 'text-os-warning', bg: 'bg-os-warningDim' },
  error: { icon: AlertTriangle, color: 'text-os-danger', bg: 'bg-os-dangerDim' },
}

const categoryGroups = [
  'Comunicación', 'Automatización', 'Datos', 'CRM', 'Captación', 'Marketing', 'Infraestructura',
]

export default function SettingsPage() {
  const connected = mockIntegrations.filter(i => i.status === 'connected').length
  const errors = mockIntegrations.filter(i => i.status === 'error').length

  return (
    <div>
      <Header title="Integraciones & Configuración" subtitle="Conectores del sistema — estado y configuración" />
      <div className="p-6 space-y-6 animate-fade-in-up">

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Conectadas', value: connected, color: 'text-os-success' },
            { label: 'Con error', value: errors, color: 'text-os-danger' },
            { label: 'Pendientes', value: mockIntegrations.filter(i => i.status === 'pending').length, color: 'text-os-warning' },
            { label: 'Desconectadas', value: mockIntegrations.filter(i => i.status === 'disconnected').length, color: 'text-os-textDim' },
          ].map(item => (
            <div key={item.label} className="bg-os-card border border-os-border rounded-2xl p-5 text-center">
              <p className={cn('text-3xl font-bold', item.color)}>{item.value}</p>
              <p className="text-xs text-os-textDim mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Integration Cards by category */}
        {categoryGroups.map(category => {
          const items = mockIntegrations.filter(i => i.category === category)
          if (!items.length) return null
          return (
            <SectionCard
              key={category}
              title={category}
              subtitle={`${items.length} integración${items.length > 1 ? 'es' : ''}`}
              icon={Settings}
              noPadding
            >
              <div className="divide-y divide-os-border/50">
                {items.map((integration) => {
                  const Icon = iconMap[integration.icon] || Settings
                  const status = statusConfig[integration.status]
                  const StatusIcon = status.icon

                  return (
                    <div key={integration.id} className="flex items-center gap-4 px-5 py-4 hover:bg-os-border/20 transition-all group">
                      {/* Icon */}
                      <div className="w-10 h-10 bg-os-border rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-os-muted" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{integration.name}</p>
                          <StatusBadge value={integration.status} size="xs" showDot />
                        </div>
                        <p className="text-[11px] text-os-textDim mt-0.5">{integration.description}</p>
                        {integration.lastSync && (
                          <p className="text-[10px] text-os-textDim mt-1">
                            Última sincronización: {timeAgo(integration.lastSync)}
                          </p>
                        )}
                        {/* Config fields preview */}
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {integration.configFields.map(field => (
                            <span key={field} className="text-[10px] text-os-textDim bg-os-border px-1.5 py-0.5 rounded font-mono">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Status + Configure */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={cn('p-1.5 rounded-lg', status.bg)}>
                          <StatusIcon size={14} className={status.color} />
                        </div>
                        <button className={cn(
                          'flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-all',
                          integration.status === 'connected'
                            ? 'border-os-border text-os-muted hover:border-os-accent hover:text-white'
                            : 'border-os-accent text-os-accent hover:bg-os-accentGlow'
                        )}>
                          {integration.status === 'connected' ? 'Configurar' : 'Conectar'}
                          <ChevronRight size={11} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </SectionCard>
          )
        })}

        {/* N8N Quicklink */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-500/15 rounded-xl">
                <Zap size={18} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">N8N Automation Server</p>
                <p className="text-[11px] text-os-textDim">Servidor local corriendo en http://localhost:5678</p>
              </div>
            </div>
            <a
              href="http://localhost:5678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 px-4 py-2 rounded-xl transition-all hover:bg-yellow-500/10"
            >
              Abrir N8N <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* WhatsApp Bot status */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-500/15 rounded-xl">
                <MessageCircle size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Bot Luz — WhatsApp</p>
                <p className="text-[11px] text-os-textDim">
                  wweb-server.js en ~/mi-whatsapp-bot · Puerto 3001
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-os-success rounded-full pulse-dot" />
                <span className="text-xs text-os-success font-semibold">Activo</span>
              </div>
              <button className="text-xs text-os-muted border border-os-border px-4 py-2 rounded-xl hover:border-green-500/40 hover:text-white transition-all">
                Ver logs
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
