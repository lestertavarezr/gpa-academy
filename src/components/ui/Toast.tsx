'use client'

import { useStore } from '@/lib/store'
import { CheckCircle2, AlertTriangle, Info, X, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const config = {
  success: { icon: CheckCircle2, color: 'text-os-success', bg: 'bg-os-successDim border-os-success/30' },
  error:   { icon: XCircle,      color: 'text-os-danger',  bg: 'bg-os-dangerDim  border-os-danger/30'  },
  warning: { icon: AlertTriangle, color: 'text-os-warning', bg: 'bg-os-warningDim border-os-warning/30' },
  info:    { icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-500/10   border-blue-500/20'   },
}

export default function Toasts() {
  const { state, dispatch } = useStore()

  if (!state.notifications.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {state.notifications.map(n => {
        const c = config[n.type]
        const Icon = c.icon
        return (
          <div
            key={n.id}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-card pointer-events-auto',
              'animate-slide-in backdrop-blur-md glass',
              c.bg
            )}
          >
            <Icon size={15} className={c.color} />
            <span className="text-sm text-white font-medium">{n.message}</span>
            <button
              onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', id: n.id })}
              className="ml-2 text-os-textDim hover:text-white transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
