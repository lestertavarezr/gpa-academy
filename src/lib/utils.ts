import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy', { locale: es })
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd MMM, HH:mm', { locale: es })
  } catch {
    return dateStr
  }
}

export function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: es })
  } catch {
    return dateStr
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 1_000_000) return `RD$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `RD$${(amount / 1_000).toFixed(0)}K`
  return `RD$${amount}`
}

export function getProgressColor(value: number): string {
  if (value >= 80) return 'bg-os-success'
  if (value >= 50) return 'bg-os-warning'
  return 'bg-os-danger'
}

export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value))
}
