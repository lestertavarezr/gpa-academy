'use client'

import { useState } from 'react'
import { CheckSquare, AlertTriangle, Clock, User, Filter, TrendingUp } from 'lucide-react'
import Header from '@/components/layout/Header'
import KPICard from '@/components/ui/KPICard'
import SectionCard from '@/components/ui/SectionCard'
import StatusBadge from '@/components/ui/StatusBadge'
import { useStore } from '@/lib/store'
import { formatDate, cn } from '@/lib/utils'
import type { TaskPriority, TaskStatus } from '@/types'

const priorityOrder: Record<TaskPriority, number> = { crítica: 0, alta: 1, media: 2, baja: 3 }
const categoryColors: Record<string, string> = {
  Ventas:          'text-green-400 bg-green-500/10',
  Académico:       'text-blue-400  bg-blue-500/10',
  Automatizaciones:'text-yellow-400 bg-yellow-500/10',
  Marketing:       'text-pink-400  bg-pink-500/10',
  Finanzas:        'text-orange-400 bg-orange-500/10',
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'pendiente',   label: 'Pendiente'   },
  { value: 'en_progreso', label: 'En progreso' },
  { value: 'completada',  label: 'Completada'  },
  { value: 'bloqueada',   label: 'Bloqueada'   },
]

export default function TasksPage() {
  const { state, toggleTask, updateTaskStatus } = useStore()
  const { tasks } = state

  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'todas'>('todas')
  const [filterStatus, setFilterStatus]     = useState<TaskStatus | 'todas'>('todas')

  const filtered = [...tasks]
    .filter(t => filterPriority === 'todas' || t.priority === filterPriority)
    .filter(t => filterStatus   === 'todas' || t.status   === filterStatus)
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  const pending    = tasks.filter(t => t.status === 'pendiente').length
  const inProgress = tasks.filter(t => t.status === 'en_progreso').length
  const critical   = tasks.filter(t => t.priority === 'crítica' && t.status !== 'completada').length
  const completed  = tasks.filter(t => t.status === 'completada').length

  return (
    <div>
      <Header title="Tareas & Centro de Control" subtitle="Operaciones, seguimiento y ejecución" />
      <div className="p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPICard title="Pendientes"  value={pending}    icon={Clock}        variant={critical > 0 ? 'warning' : 'default'} subtitle={`${critical} críticas`} />
          <KPICard title="En progreso" value={inProgress} icon={TrendingUp}   variant="accent"  subtitle="Actualmente" />
          <KPICard title="Críticas"    value={critical}   icon={AlertTriangle} variant={critical > 0 ? 'danger' : 'default'} subtitle="Atención ya" />
          <KPICard title="Completadas" value={completed}  icon={CheckSquare}  variant="success" subtitle="Cerradas" />
        </div>

        {/* Priority overview */}
        <div className="grid grid-cols-4 gap-3">
          {(['crítica', 'alta', 'media', 'baja'] as TaskPriority[]).map(priority => {
            const count = tasks.filter(t => t.priority === priority && t.status !== 'completada').length
            return (
              <button key={priority}
                onClick={() => setFilterPriority(filterPriority === priority ? 'todas' : priority)}
                className={cn(
                  'bg-os-card border rounded-xl p-4 text-left transition-all hover:border-os-accent',
                  filterPriority === priority ? 'border-os-accent bg-os-accentGlow' : 'border-os-border'
                )}>
                <StatusBadge value={priority} size="xs" />
                <p className="text-2xl font-bold text-white mt-2">{count}</p>
                <p className="text-[11px] text-os-textDim">{tasks.filter(t => t.priority === priority).length} total</p>
              </button>
            )
          })}
        </div>

        {/* Task list */}
        <SectionCard
          title="Centro de Control"
          subtitle={`${filtered.length} tareas${filterPriority !== 'todas' || filterStatus !== 'todas' ? ' (filtradas)' : ''}`}
          icon={CheckSquare}
          action={
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as TaskStatus | 'todas')}
                className="text-xs bg-os-border border border-os-borderLight text-os-muted rounded-lg px-2 py-1.5 outline-none focus:border-os-accent cursor-pointer"
              >
                <option value="todas">Todos los estados</option>
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {(filterPriority !== 'todas' || filterStatus !== 'todas') && (
                <button
                  onClick={() => { setFilterPriority('todas'); setFilterStatus('todas') }}
                  className="text-xs text-os-accent hover:text-purple-300 border border-os-accent/30 px-2 py-1.5 rounded-lg transition-all"
                >
                  Limpiar
                </button>
              )}
            </div>
          }
          noPadding
        >
          <div className="divide-y divide-os-border/50">
            {filtered.map((task, idx) => {
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completada'
              const catStyle  = categoryColors[task.category] || 'text-os-muted bg-os-border'
              const isDone    = task.status === 'completada'

              return (
                <div key={task.id}
                  className={cn('flex items-start gap-4 px-5 py-4 hover:bg-os-border/20 transition-all group', isDone && 'opacity-50')}
                  style={{ animationDelay: `${idx * 20}ms` }}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      'mt-0.5 w-4 h-4 rounded border flex-shrink-0 transition-all hover:scale-110 cursor-pointer',
                      isDone
                        ? 'bg-os-success border-os-success flex items-center justify-center'
                        : task.status === 'en_progreso'
                        ? 'border-os-accent bg-os-accentGlow'
                        : 'border-os-borderLight hover:border-os-accent'
                    )}
                    title={isDone ? 'Marcar pendiente' : 'Marcar completada'}
                  >
                    {isDone && <span className="text-[8px] text-white font-bold">✓</span>}
                  </button>

                  {/* Task info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium leading-snug', isDone ? 'line-through text-os-textDim' : 'text-white')}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full', catStyle)}>{task.category}</span>
                      <span className="flex items-center gap-1 text-[11px] text-os-textDim"><User size={10} />{task.assignedTo}</span>
                      <span className={cn('flex items-center gap-1 text-[11px]', isOverdue ? 'text-os-danger font-medium' : 'text-os-textDim')}>
                        <Clock size={10} />{isOverdue && '⚠ '}{formatDate(task.dueDate)}
                      </span>
                    </div>
                    {task.tags.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {task.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-os-textDim bg-os-border px-1.5 py-0.5 rounded-md">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status selector */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <StatusBadge value={task.priority} size="xs" />
                    <select
                      value={task.status}
                      onChange={e => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className="text-[10px] bg-os-border border border-os-borderLight text-os-muted rounded-lg px-1.5 py-1 outline-none focus:border-os-accent cursor-pointer transition-all hover:border-os-accent"
                      onClick={e => e.stopPropagation()}
                    >
                      {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-os-textDim">
                Sin tareas con ese filtro
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
