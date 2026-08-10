'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { mockLeadsBySource } from '@/lib/mock-data'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; payload: { fill: string } }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-os-card border border-os-border rounded-xl p-2.5 shadow-card text-xs">
      <p className="font-semibold text-white">{item.name}</p>
      <p className="text-os-muted">{item.value} leads</p>
    </div>
  )
}

export default function LeadSourceChart() {
  const total = mockLeadsBySource.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex items-center gap-4">
      <div className="flex-shrink-0">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie
              data={mockLeadsBySource}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={55}
              dataKey="value"
              strokeWidth={2}
              stroke="#07070f"
            >
              {mockLeadsBySource.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2">
        {mockLeadsBySource.map((item) => (
          <div key={item.source} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
              <span className="text-xs text-os-muted">{item.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-os-surface rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${(item.value / total) * 100}%`,
                    backgroundColor: item.fill,
                  }}
                />
              </div>
              <span className="text-xs font-semibold text-white w-6 text-right">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
