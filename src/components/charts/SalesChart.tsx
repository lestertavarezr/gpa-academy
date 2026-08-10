'use client'

import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { mockSalesChart } from '@/lib/mock-data'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-os-card border border-os-border rounded-xl p-3 shadow-card text-xs">
      <p className="font-semibold text-white mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="text-os-textDim capitalize">{entry.name}</span>
          <span className="font-semibold" style={{ color: entry.color }}>
            {entry.name === 'ingresos'
              ? `RD$${(entry.value / 1000).toFixed(0)}K`
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <ComposedChart data={mockSalesChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: '#64748b', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          yAxisId="left"
          dataKey="ventas"
          fill="#6366f1"
          radius={[4, 4, 0, 0]}
          opacity={0.85}
          name="ventas"
        />
        <Bar
          yAxisId="left"
          dataKey="leads"
          fill="#1e1e2e"
          radius={[4, 4, 0, 0]}
          opacity={0.6}
          name="leads"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="ingresos"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          name="ingresos"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
