// ─── LEADS & VENTAS ──────────────────────────────────────────────────────────

export type LeadStatus = 'nuevo' | 'contactado' | 'interesado' | 'pendiente' | 'cerrado' | 'perdido'
export type LeadSource = 'Instagram' | 'WhatsApp' | 'Formulario' | 'Referido' | 'Web' | 'Otro'
export type LeadTemp = 'frio' | 'tibio' | 'caliente'

export interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  status: LeadStatus
  source: LeadSource
  temperature: LeadTemp
  program?: string
  notes?: string
  createdAt: string
  lastContact: string
  followUpDate?: string
  assignedTo?: string
  value?: number
}

export interface Sale {
  id: string
  leadId: string
  leadName: string
  program: string
  amount: number
  date: string
  paymentMethod: string
  status: 'pendiente' | 'completado' | 'reembolsado'
}

// ─── AUTOMATIZACIONES ────────────────────────────────────────────────────────

export type AutomationStatus = 'activa' | 'pausada' | 'error'
export type AutomationType = 'WhatsApp' | 'Email' | 'N8N' | 'Formulario' | 'CRM' | 'Sheets'

export interface Automation {
  id: string
  name: string
  description: string
  status: AutomationStatus
  type: AutomationType
  lastRun: string
  nextRun?: string
  successRate: number
  totalRuns: number
  failedRuns: number
  trigger: string
  tags: string[]
}

export interface AutomationLog {
  id: string
  automationId: string
  automationName: string
  timestamp: string
  status: 'success' | 'error' | 'warning'
  message: string
  duration?: number
}

// ─── OPERACIONES ACADÉMICAS ───────────────────────────────────────────────────

export type ProgramStatus = 'activo' | 'próximo' | 'pausado' | 'completado'

export interface Program {
  id: string
  name: string
  category: string
  status: ProgramStatus
  studentsCount: number
  maxStudents: number
  startDate: string
  endDate?: string
  instructor: string
  price: number
  pendingCertificates: number
  pendingMaterials: number
  nextClass?: string
  completionRate: number
}

export interface Student {
  id: string
  name: string
  phone: string
  email?: string
  program: string
  programId: string
  enrollmentDate: string
  status: 'activo' | 'completado' | 'suspendido'
  pendingCertificate: boolean
  paymentStatus: 'al_día' | 'pendiente' | 'atrasado'
  progress: number
}

// ─── CONTENIDO & MARKETING ────────────────────────────────────────────────────

export type ContentType = 'Reel' | 'Post' | 'Historia' | 'Email' | 'Blog' | 'Anuncio'
export type ContentStatus = 'idea' | 'en_producción' | 'revisión' | 'programado' | 'publicado'
export type ContentPlatform = 'Instagram' | 'TikTok' | 'Facebook' | 'Email' | 'YouTube' | 'WhatsApp'

export interface ContentItem {
  id: string
  title: string
  type: ContentType
  platform: ContentPlatform
  status: ContentStatus
  scheduledDate?: string
  publishedDate?: string
  assignedTo?: string
  notes?: string
  metrics?: {
    views: number
    clicks: number
    conversions: number
    engagement: number
  }
}

// ─── TAREAS ───────────────────────────────────────────────────────────────────

export type TaskPriority = 'baja' | 'media' | 'alta' | 'crítica'
export type TaskStatus = 'pendiente' | 'en_progreso' | 'completada' | 'bloqueada'

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  assignedTo: string
  dueDate: string
  createdAt: string
  completedAt?: string
  category: string
  tags: string[]
}

// ─── ALERTAS / INCIDENCIAS ───────────────────────────────────────────────────

export type AlertSeverity = 'info' | 'warning' | 'critical'
export type AlertType = 'automation_error' | 'follow_up_delayed' | 'integration_failure' | 'system' | 'lead' | 'payment'

export interface Alert {
  id: string
  title: string
  description: string
  severity: AlertSeverity
  type: AlertType
  timestamp: string
  resolved: boolean
  resolvedAt?: string
  source: string
  actionRequired?: string
}

// ─── ACTIVITY FEED ────────────────────────────────────────────────────────────

export type ActivityType =
  | 'lead_created'
  | 'lead_updated'
  | 'message_sent'
  | 'task_created'
  | 'task_completed'
  | 'automation_run'
  | 'automation_error'
  | 'sale_closed'
  | 'student_enrolled'
  | 'certificate_issued'
  | 'alert_triggered'
  | 'content_published'

export interface ActivityEvent {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  source: 'Luz Bot' | 'N8N' | 'Manual' | 'Sistema' | 'WhatsApp' | 'Formulario'
  metadata?: Record<string, string | number>
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────

export interface KPIData {
  leadsToday: number
  leadsWeek: number
  leadsMonth: number
  activeConversations: number
  salesToday: number
  salesMonth: number
  salesMonthAmount: number
  pendingTasks: number
  criticalTasks: number
  activeAutomations: number
  automationErrors: number
  totalStudents: number
  activePrograms: number
  pendingCertificates: number
  openAlerts: number
  systemHealth: number
}

// ─── SYSTEM HEALTH ────────────────────────────────────────────────────────────

export type ModuleStatus = 'operational' | 'degraded' | 'down'

export interface SystemModule {
  id: string
  name: string
  status: ModuleStatus
  uptime: number
  lastCheck: string
  description: string
  icon: string
}

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────

export type IntegrationStatus = 'connected' | 'disconnected' | 'pending' | 'error'

export interface Integration {
  id: string
  name: string
  description: string
  status: IntegrationStatus
  icon: string
  category: string
  lastSync?: string
  configFields: string[]
}
