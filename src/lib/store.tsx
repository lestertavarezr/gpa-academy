'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { Lead, Automation, Task, Alert, ContentItem, ActivityEvent } from '@/types'
import {
  mockLeads, mockAutomations, mockTasks, mockAlerts,
  mockContent, mockActivity, mockKPIs, mockSales,
  mockPrograms, mockStudents, mockSystemModules, mockIntegrations,
  mockAutomationLogs,
} from '@/lib/mock-data'

// ─── STATE ────────────────────────────────────────────────────────────────────
interface AppState {
  leads: Lead[]
  automations: typeof mockAutomations
  automationLogs: typeof mockAutomationLogs
  tasks: Task[]
  alerts: Alert[]
  content: ContentItem[]
  activity: ActivityEvent[]
  sales: typeof mockSales
  programs: typeof mockPrograms
  students: typeof mockStudents
  systemModules: typeof mockSystemModules
  integrations: typeof mockIntegrations
  kpis: typeof mockKPIs
  searchQuery: string
  notifications: Notification[]
}

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  timestamp: number
}

// ─── ACTIONS ─────────────────────────────────────────────────────────────────
type Action =
  | { type: 'RESOLVE_ALERT'; id: string }
  | { type: 'TOGGLE_TASK'; id: string }
  | { type: 'UPDATE_TASK_STATUS'; id: string; status: Task['status'] }
  | { type: 'UPDATE_LEAD_STATUS'; id: string; status: Lead['status'] }
  | { type: 'TOGGLE_AUTOMATION'; id: string }
  | { type: 'RESTART_AUTOMATION'; id: string }
  | { type: 'UPDATE_CONTENT_STATUS'; id: string; status: ContentItem['status'] }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'ADD_NOTIFICATION'; notification: Notification }
  | { type: 'REMOVE_NOTIFICATION'; id: string }
  | { type: 'LOAD_FROM_STORAGE'; state: Partial<AppState> }

// ─── INITIAL STATE ────────────────────────────────────────────────────────────
const initialState: AppState = {
  leads: mockLeads,
  automations: mockAutomations,
  automationLogs: mockAutomationLogs,
  tasks: mockTasks,
  alerts: mockAlerts,
  content: mockContent,
  activity: mockActivity,
  sales: mockSales,
  programs: mockPrograms,
  students: mockStudents,
  systemModules: mockSystemModules,
  integrations: mockIntegrations,
  kpis: mockKPIs,
  searchQuery: '',
  notifications: [],
}

// ─── REDUCER ──────────────────────────────────────────────────────────────────
function recalcKPIs(state: AppState): typeof mockKPIs {
  const openAlerts = state.alerts.filter(a => !a.resolved).length
  const criticalAlerts = state.alerts.filter(a => !a.resolved && a.severity === 'critical').length
  const pendingTasks = state.tasks.filter(t => t.status !== 'completada').length
  const criticalTasks = state.tasks.filter(t => t.priority === 'crítica' && t.status !== 'completada').length
  const activeAutomations = state.automations.filter(a => a.status === 'activa').length
  const automationErrors = state.automations.filter(a => a.status === 'error').length
  const operationalModules = state.systemModules.filter(m => m.status === 'operational').length
  const systemHealth = Math.round((operationalModules / state.systemModules.length) * 100)

  return {
    ...state.kpis,
    openAlerts,
    pendingTasks,
    criticalTasks,
    activeAutomations,
    automationErrors,
    systemHealth,
  }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {

    case 'RESOLVE_ALERT': {
      const alerts = state.alerts.map(a =>
        a.id === action.id
          ? { ...a, resolved: true, resolvedAt: new Date().toISOString() }
          : a
      )
      const newState = { ...state, alerts }
      return { ...newState, kpis: recalcKPIs(newState) }
    }

    case 'TOGGLE_TASK': {
      const tasks = state.tasks.map(t =>
        t.id === action.id
          ? {
              ...t,
              status: (t.status === 'completada' ? 'pendiente' : 'completada') as Task['status'],
              completedAt: t.status !== 'completada' ? new Date().toISOString() : undefined,
            }
          : t
      )
      const newState = { ...state, tasks }
      return { ...newState, kpis: recalcKPIs(newState) }
    }

    case 'UPDATE_TASK_STATUS': {
      const tasks = state.tasks.map(t =>
        t.id === action.id ? { ...t, status: action.status } : t
      )
      const newState = { ...state, tasks }
      return { ...newState, kpis: recalcKPIs(newState) }
    }

    case 'UPDATE_LEAD_STATUS': {
      const leads = state.leads.map(l =>
        l.id === action.id ? { ...l, status: action.status } : l
      )
      return { ...state, leads }
    }

    case 'TOGGLE_AUTOMATION': {
      const now = new Date().toISOString()
      const automations = state.automations.map(a => {
        if (a.id !== action.id) return a
        const newStatus = a.status === 'activa' ? 'pausada' : 'activa'
        return { ...a, status: newStatus as Automation['status'] }
      })
      const systemModules = state.systemModules.map(m => {
        if (m.id === 'sm-002') {
          const errors = automations.filter(a => a.status === 'error').length
          return {
            ...m,
            status: errors > 0 ? 'degraded' : 'operational' as typeof m.status,
            lastCheck: now,
            description: `${automations.filter(a => a.status === 'activa').length} workflows activos. ${errors} errores.`,
          }
        }
        return m
      })
      const newState = { ...state, automations, systemModules }
      return { ...newState, kpis: recalcKPIs(newState) }
    }

    case 'RESTART_AUTOMATION': {
      const now = new Date().toISOString()
      const automations = state.automations.map(a =>
        a.id === action.id
          ? { ...a, status: 'activa' as Automation['status'], lastRun: now }
          : a
      )
      const newLog = {
        id: `log-${Date.now()}`,
        automationId: action.id,
        automationName: state.automations.find(a => a.id === action.id)?.name || '',
        timestamp: now,
        status: 'success' as const,
        message: 'Automatización reiniciada manualmente.',
        duration: 0,
      }
      const newState = {
        ...state,
        automations,
        automationLogs: [newLog, ...state.automationLogs],
      }
      return { ...newState, kpis: recalcKPIs(newState) }
    }

    case 'UPDATE_CONTENT_STATUS': {
      const content = state.content.map(c =>
        c.id === action.id ? { ...c, status: action.status } : c
      )
      return { ...state, content }
    }

    case 'SET_SEARCH': {
      return { ...state, searchQuery: action.query }
    }

    case 'ADD_NOTIFICATION': {
      return {
        ...state,
        notifications: [action.notification, ...state.notifications].slice(0, 5),
      }
    }

    case 'REMOVE_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.id),
      }
    }

    case 'LOAD_FROM_STORAGE': {
      return { ...state, ...action.state }
    }

    default:
      return state
  }
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
interface StoreContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  // Helpers
  resolveAlert: (id: string) => void
  toggleTask: (id: string) => void
  updateTaskStatus: (id: string, status: Task['status']) => void
  updateLeadStatus: (id: string, status: Lead['status']) => void
  toggleAutomation: (id: string) => void
  restartAutomation: (id: string) => void
  updateContentStatus: (id: string, status: ContentItem['status']) => void
  setSearch: (query: string) => void
  notify: (message: string, type?: Notification['type']) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Persist to localStorage (only mutable data)
  useEffect(() => {
    try {
      const toSave = {
        leads: state.leads,
        automations: state.automations,
        tasks: state.tasks,
        alerts: state.alerts,
        content: state.content,
        systemModules: state.systemModules,
      }
      localStorage.setItem('gpa-os-state', JSON.stringify(toSave))
    } catch {}
  }, [state.leads, state.automations, state.tasks, state.alerts, state.content, state.systemModules])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gpa-os-state')
      if (saved) {
        dispatch({ type: 'LOAD_FROM_STORAGE', state: JSON.parse(saved) })
      }
    } catch {}
  }, [])

  // Auto-remove notifications after 4s
  useEffect(() => {
    if (state.notifications.length === 0) return
    const latest = state.notifications[0]
    const timer = setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', id: latest.id })
    }, 4000)
    return () => clearTimeout(timer)
  }, [state.notifications])

  const notify = useCallback((message: string, type: Notification['type'] = 'success') => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      notification: { id: Date.now().toString(), message, type, timestamp: Date.now() },
    })
  }, [])

  const resolveAlert = useCallback((id: string) => {
    dispatch({ type: 'RESOLVE_ALERT', id })
    notify('Alerta marcada como resuelta')
  }, [notify])

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_TASK', id })
  }, [])

  const updateTaskStatus = useCallback((id: string, status: Task['status']) => {
    dispatch({ type: 'UPDATE_TASK_STATUS', id, status })
    notify(`Tarea actualizada: ${status.replace('_', ' ')}`)
  }, [notify])

  const updateLeadStatus = useCallback((id: string, status: Lead['status']) => {
    dispatch({ type: 'UPDATE_LEAD_STATUS', id, status })
    notify(`Lead actualizado: ${status}`)
  }, [notify])

  const toggleAutomation = useCallback((id: string) => {
    const auto = state.automations.find(a => a.id === id)
    dispatch({ type: 'TOGGLE_AUTOMATION', id })
    notify(auto?.status === 'activa' ? 'Automatización pausada' : 'Automatización activada')
  }, [state.automations, notify])

  const restartAutomation = useCallback((id: string) => {
    dispatch({ type: 'RESTART_AUTOMATION', id })
    notify('Automatización reiniciada correctamente', 'success')
  }, [notify])

  const updateContentStatus = useCallback((id: string, status: ContentItem['status']) => {
    dispatch({ type: 'UPDATE_CONTENT_STATUS', id, status })
    notify(`Contenido actualizado: ${status}`)
  }, [notify])

  const setSearch = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH', query })
  }, [])

  return (
    <StoreContext.Provider value={{
      state, dispatch,
      resolveAlert, toggleTask, updateTaskStatus,
      updateLeadStatus, toggleAutomation, restartAutomation,
      updateContentStatus, setSearch, notify,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
