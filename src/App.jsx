import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import StatCards from './components/StatCards'
import GrowthChart from './components/GrowthChart'
import LocationChart from './components/LocationChart'
import TopContributors from './components/TopContributors'
import EventAttendanceChart from './components/EventAttendanceChart'
import {
  computeStats,
  computeGrowth,
  computeLocations,
  computeTopContributors,
  computeEventAttendance,
} from './utils/parseMembers'

export default function App() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}members.csv`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then(text => {
        const { data } = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        })
        setMembers(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen gap-3 text-slate-400 ${isDark ? 'dark bg-[#0f1117]' : 'bg-slate-100'}`}>
        <div className="w-5 h-5 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
        Cargando datos…
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen text-red-400 ${isDark ? 'dark bg-[#0f1117]' : 'bg-slate-100'}`}>
        Error al cargar datos: {error}
      </div>
    )
  }

  const stats = computeStats(members)
  const growth = computeGrowth(members)
  const locations = computeLocations(members)
  const topContributors = computeTopContributors(members)
  const eventAttendance = computeEventAttendance(members)

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#0f1117] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-[#232F3E] border-b border-slate-200 dark:border-[#2a3547] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <span className="text-[#FF9900] text-2xl font-black">⚡</span>
          <div>
            <h1 className="text-slate-900 dark:text-white font-bold leading-tight">AWS User Group Ensenada</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Dashboard de la comunidad</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <p className="text-slate-400 dark:text-slate-500 text-xs hidden sm:block">
              Datos exportados de Meetup
            </p>
            <button
              onClick={() => setIsDark(prev => !prev)}
              className="p-2 rounded-lg border border-slate-200 dark:border-[#2a3547] bg-slate-50 dark:bg-[#1a2233] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#232F3E] transition-colors text-sm"
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <StatCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GrowthChart data={growth} isDark={isDark} />
          </div>
          <div>
            <LocationChart data={locations} isDark={isDark} />
          </div>
        </div>

        <EventAttendanceChart data={eventAttendance} isDark={isDark} />

        <TopContributors members={topContributors} />
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-6 mt-4 border-t border-slate-200 dark:border-[#2a3547]">
        <p className="text-slate-400 dark:text-slate-600 text-xs text-center">
          AWS User Group Ensenada · {members.length} miembros registrados
        </p>
      </footer>
    </div>
  )
}
