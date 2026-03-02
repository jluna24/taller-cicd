const CARDS = [
  {
    key: 'total',
    label: 'Total miembros',
    icon: '👥',
    color: 'from-orange-500/20 to-transparent',
    border: 'border-orange-500/30',
  },
  {
    key: 'cities',
    label: 'Ciudades',
    icon: '📍',
    color: 'from-blue-500/20 to-transparent',
    border: 'border-blue-500/30',
  },
  {
    key: 'active',
    label: 'Miembros activos',
    icon: '⚡',
    color: 'from-green-500/20 to-transparent',
    border: 'border-green-500/30',
  },
  {
    key: 'organizers',
    label: 'Organizadores',
    icon: '⭐',
    color: 'from-purple-500/20 to-transparent',
    border: 'border-purple-500/30',
  },
]

export default function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon, color, border }) => (
        <div
          key={key}
          className={`rounded-xl border ${border} bg-gradient-to-br ${color} bg-[#1a2233] p-5`}
        >
          <div className="text-2xl mb-2">{icon}</div>
          <div className="text-3xl font-bold text-white">{stats[key]}</div>
          <div className="text-sm text-slate-400 mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
