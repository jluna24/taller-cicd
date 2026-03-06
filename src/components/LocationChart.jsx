import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-[#1a2233] border border-slate-200 dark:border-[#2a3547] rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-700 dark:text-slate-300 font-medium">{label}</p>
      <p className="text-[#FF9900] font-bold">{payload[0].value} miembros</p>
    </div>
  )
}

export default function LocationChart({ data, isDark = true }) {
  const gridColor = isDark ? '#2a3547' : '#e2e8f0'
  const tickColorX = isDark ? '#64748b' : '#94a3b8'
  const tickColorY = isDark ? '#94a3b8' : '#475569'
  const cursorFill = isDark ? '#ffffff08' : '#00000008'

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#2a3547] bg-white dark:bg-[#1a2233] p-5 h-full">
      <h2 className="text-slate-900 dark:text-white font-semibold text-base mb-4">Top ciudades</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: tickColorX, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="ciudad"
            tick={{ fill: tickColorY, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={88}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill }} />
          <Bar dataKey="miembros" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? '#FF9900' : `rgba(255,153,0,${0.75 - i * 0.06})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
