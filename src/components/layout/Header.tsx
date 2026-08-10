'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, RefreshCw, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import Link from 'next/link'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { state, setSearch } = useStore()
  const [searchFocused, setSearchFocused] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const [clock, setClock] = useState('')
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }))
      setDateStr(now.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const handleSearch = (val: string) => {
    setLocalSearch(val)
    setSearch(val)
  }

  const clearSearch = () => {
    setLocalSearch('')
    setSearch('')
  }

  const openAlerts = state.alerts.filter(a => !a.resolved)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-os-surface/95 backdrop-blur-md border-b border-os-border">
      {/* Left: Title */}
      <div>
        <h1 className="font-display text-xl text-os-text leading-tight">{title}</h1>
        {subtitle && <p className="font-tech text-os-textDim mt-0.5">{subtitle}</p>}
      </div>

      {/* Center: Search */}
      <div className={cn(
        'relative flex items-center gap-2 bg-os-card border rounded-xl px-3 py-2 transition-all duration-200 w-72',
        searchFocused ? 'border-os-accent shadow-glow-accent' : 'border-os-border'
      )}>
        <Search size={14} className="text-os-textDim flex-shrink-0" />
        <input
          type="text"
          value={localSearch}
          placeholder="Buscar leads, tareas, programas..."
          className="bg-transparent text-sm text-os-text placeholder-os-textDim outline-none w-full"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onChange={e => handleSearch(e.target.value)}
        />
        {localSearch && (
          <button onClick={clearSearch} className="text-os-textDim hover:text-white transition-colors">
            <X size={13} />
          </button>
        )}
        {!localSearch && (
          <kbd className="hidden sm:block text-[10px] text-os-textDim bg-os-border px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="hidden md:flex flex-col items-end">
          <span className="font-mono text-sm font-semibold text-os-accent tabular-nums">{clock}</span>
          <span className="font-tech text-os-textDim capitalize" style={{ fontSize: '0.62rem' }}>{dateStr}</span>
        </div>

        {/* Refresh */}
        <button
          onClick={() => window.location.reload()}
          className="p-2 rounded-lg text-os-textDim hover:text-white hover:bg-os-border transition-all"
          title="Recargar"
        >
          <RefreshCw size={15} />
        </button>

        {/* Alerts bell */}
        <Link
          href="/alerts"
          className="relative p-2 rounded-lg text-os-textDim hover:text-white hover:bg-os-border transition-all"
        >
          <Bell size={15} />
          {openAlerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-os-danger rounded-full pulse-dot" />
          )}
        </Link>

        {/* User */}
        <button className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-os-card border border-os-border rounded-xl hover:border-os-accent transition-all">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-os-accent to-[#006B73] flex items-center justify-center text-[10px] font-bold text-[#050B16]">
            L
          </div>
          <span className="text-xs font-medium text-os-text hidden sm:block">CEO</span>
          <ChevronDown size={12} className="text-os-textDim" />
        </button>
      </div>
    </header>
  )
}
