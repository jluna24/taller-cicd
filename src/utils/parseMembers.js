export function computeStats(members) {
  const total = members.length
  const cities = new Set(members.map(m => m.Location).filter(Boolean)).size
  const active = members.filter(m => Number(m['Events attended']) > 0).length
  const organizers = members.filter(m => m.Role && m.Role !== 'MEMBER').length
  return { total, cities, active, organizers }
}

export function computeGrowth(members) {
  const monthMap = {}
  members.forEach(m => {
    const dateStr = m['Joined Group on']
    if (!dateStr) return
    const d = new Date(dateStr)
    if (isNaN(d)) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthMap[key] = (monthMap[key] || 0) + 1
  })

  let cumulative = 0
  return Object.entries(monthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, nuevos]) => {
      cumulative += nuevos
      const [year, month] = key.split('-')
      const label = new Date(Number(year), Number(month) - 1).toLocaleDateString('es-MX', {
        month: 'short',
        year: '2-digit',
      })
      return { mes: label, total: cumulative, nuevos }
    })
}

export function computeLocations(members) {
  const map = {}
  members.forEach(m => {
    const loc = m.Location || 'Desconocida'
    map[loc] = (map[loc] || 0) + 1
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([ciudad, miembros]) => ({ ciudad, miembros }))
}

export function computeTopContributors(members, n = 10) {
  return [...members]
    .filter(m => Number(m['Events attended']) > 0)
    .sort((a, b) => Number(b['Events attended']) - Number(a['Events attended']))
    .slice(0, n)
}

export function computeEventAttendance(members) {
  const eventMap = {}
  members.forEach(m => {
    const dateStr = m['Last Attended']
    if (!dateStr) return
    const d = new Date(dateStr)
    if (isNaN(d)) return
    const key = d.toISOString().slice(0, 10) // "YYYY-MM-DD"
    eventMap[key] = (eventMap[key] || 0) + 1
  })

  return Object.entries(eventMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, asistentes]) => {
      const d = new Date(key)
      const fecha = d.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      })
      return { fecha, asistentes, fechaCompleta: key }
    })
}
