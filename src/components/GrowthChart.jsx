import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#1a2233] border border-slate-200 dark:border-[#2a3547] rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function GrowthChart({ data, isDark = true }) {
  const gridColor = isDark ? '#2a3547' : '#e2e8f0'
  const tickColor = isDark ? '#64748b' : '#94a3b8'
  const legendColor = isDark ? '#94a3b8' : '#475569'

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#2a3547] bg-white dark:bg-[#1a2233] p-5">
      <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-4">Crecimiento de la comunidad</h2>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF9900" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF9900" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="mes"
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: legendColor, paddingTop: 8 }}
            formatter={v => (v === 'total' ? 'Total acumulado' : 'Nuevos')}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#FF9900"
            strokeWidth={2}
            fill="url(#totalGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#FF9900' }}
          />
          <Bar dataKey="nuevos" fill="#FF990055" radius={[2, 2, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
