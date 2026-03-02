import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a2233] border border-[#2a3547] rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      <p style={{ color: '#FF9900' }}>
        Asistentes: <span className="font-bold">{payload[0].value}</span>
      </p>
    </div>
  )
}

export default function EventAttendanceChart({ data }) {
  return (
    <div className="rounded-xl border border-[#2a3547] bg-[#1a2233] p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-white font-semibold text-base">Asistencia a eventos en el tiempo</h2>
          <p className="text-slate-500 text-xs mt-0.5">Miembros por evento · basado en última asistencia registrada</p>
        </div>
        <span className="text-2xl text-[#FF9900] font-black">{data.length}</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 16, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9900" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#FF9900" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a3547" vertical={false} />
          <XAxis
            dataKey="fecha"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2a354740' }} />
          <Bar dataKey="asistentes" fill="url(#attendanceGradient)" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="asistentes"
              position="top"
              style={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
