'use client'

import { mockFunnelData } from '@/lib/mock-data'

export default function FunnelChart() {
  const max = mockFunnelData[0].value

  return (
    <div className="space-y-2">
      {mockFunnelData.map((item, idx) => {
        const pct = (item.value / max) * 100
        const convRate = idx > 0
          ? ((item.value / mockFunnelData[idx - 1].value) * 100).toFixed(0)
          : '100'

        return (
          <div key={item.stage}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-os-muted">{item.stage}</span>
              <div className="flex items-center gap-2">
                {idx > 0 && (
                  <span className="text-[10px] text-os-textDim">{convRate}% conv.</span>
                )}
                <span className="text-xs font-bold text-white tabular-nums">{item.value}</span>
              </div>
            </div>
            <div className="relative h-7 bg-os-surface rounded-lg overflow-hidden border border-os-border">
              <div
                className="absolute inset-y-0 left-0 rounded-lg transition-all duration-700 flex items-center justify-end pr-2"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${item.color}40, ${item.color}90)`,
                  borderRight: `2px solid ${item.color}`,
                }}
              >
                <span className="text-[11px] font-semibold text-white/80">{item.value}</span>
              </div>
            </div>
          </div>
        )
      })}

      {/* Conversion rate */}
      <div className="mt-3 pt-3 border-t border-os-border flex items-center justify-between">
        <span className="text-xs text-os-textDim">Tasa de cierre global</span>
        <span className="text-sm font-bold text-os-success">
          {((mockFunnelData[4].value / mockFunnelData[0].value) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  )
}
