import { describe, it, expect } from 'vitest'
import {
  computeStats,
  computeGrowth,
  computeLocations,
  computeTopContributors,
  computeEventAttendance,
} from './parseMembers'

describe('computeStats', () => {
  it('debe calcular estadísticas correctamente con datos válidos', () => {
    const members = [
      { Location: 'Ensenada', 'Events attended': '5', Role: 'ORGANIZER' },
      { Location: 'Tijuana', 'Events attended': '0', Role: 'MEMBER' },
      { Location: 'Ensenada', 'Events attended': '3', Role: 'MEMBER' },
      { Location: 'Mexicali', 'Events attended': '2', Role: 'MEMBER' },
    ]

    const result = computeStats(members)

    expect(result.total).toBe(4)
    expect(result.cities).toBe(3)
    expect(result.active).toBe(3)
    expect(result.organizers).toBe(1)
  })

  it('debe manejar arreglo vacío', () => {
    const result = computeStats([])

    expect(result.total).toBe(0)
    expect(result.cities).toBe(0)
    expect(result.active).toBe(0)
    expect(result.organizers).toBe(0)
  })

  it('debe filtrar ubicaciones vacías al contar ciudades', () => {
    const members = [
      { Location: 'Ensenada', 'Events attended': '0', Role: 'MEMBER' },
      { Location: '', 'Events attended': '0', Role: 'MEMBER' },
      { Location: null, 'Events attended': '0', Role: 'MEMBER' },
    ]

    const result = computeStats(members)

    expect(result.cities).toBe(1)
  })

  it('debe contar solo miembros con eventos > 0 como activos', () => {
    const members = [
      { Location: 'Ensenada', 'Events attended': '0', Role: 'MEMBER' },
      { Location: 'Ensenada', 'Events attended': '1', Role: 'MEMBER' },
      { Location: 'Ensenada', 'Events attended': '10', Role: 'MEMBER' },
    ]

    const result = computeStats(members)

    expect(result.active).toBe(2)
  })

  it('debe contar organizadores correctamente excluyendo MEMBER', () => {
    const members = [
      { Location: 'Ensenada', 'Events attended': '0', Role: 'ORGANIZER' },
      { Location: 'Ensenada', 'Events attended': '0', Role: 'MEMBER' },
      { Location: 'Ensenada', 'Events attended': '0', Role: 'CO-ORGANIZER' },
      { Location: 'Ensenada', 'Events attended': '0', Role: 'ASSISTANT_ORGANIZER' },
    ]

    const result = computeStats(members)

    expect(result.organizers).toBe(3)
  })
})

describe('computeGrowth', () => {
  it('debe calcular el crecimiento acumulativo correctamente', () => {
    const members = [
      { 'Joined Group on': '2024-01-15' },
      { 'Joined Group on': '2024-01-20' },
      { 'Joined Group on': '2024-02-10' },
      { 'Joined Group on': '2024-02-15' },
    ]

    const result = computeGrowth(members)

    expect(result).toHaveLength(2)
    expect(result[0].nuevos).toBe(2)
    expect(result[0].total).toBe(2)
    expect(result[1].nuevos).toBe(2)
    expect(result[1].total).toBe(4)
  })

  it('debe ordenar por fecha ascendente', () => {
    const members = [
      { 'Joined Group on': '2024-03-15' },
      { 'Joined Group on': '2024-01-10' },
      { 'Joined Group on': '2024-02-20' },
    ]

    const result = computeGrowth(members)

    expect(result[0].mes).toMatch(/ene/)
    expect(result[1].mes).toMatch(/feb/)
    expect(result[2].mes).toMatch(/mar/)
  })

  it('debe ignorar fechas inválidas o vacías', () => {
    const members = [
      { 'Joined Group on': '2024-01-15' },
      { 'Joined Group on': '' },
      { 'Joined Group on': 'invalid-date' },
      { 'Joined Group on': null },
    ]

    const result = computeGrowth(members)

    expect(result).toHaveLength(1)
    expect(result[0].total).toBe(1)
  })

  it('debe retornar arreglo vacío con datos vacíos', () => {
    const result = computeGrowth([])

    expect(result).toEqual([])
  })
})

describe('computeLocations', () => {
  it('debe retornar las top 10 ubicaciones ordenadas por cantidad', () => {
    const members = [
      { Location: 'Ensenada' },
      { Location: 'Ensenada' },
      { Location: 'Ensenada' },
      { Location: 'Tijuana' },
      { Location: 'Tijuana' },
      { Location: 'Mexicali' },
    ]

    const result = computeLocations(members)

    expect(result).toHaveLength(3)
    expect(result[0]).toEqual({ ciudad: 'Ensenada', miembros: 3 })
    expect(result[1]).toEqual({ ciudad: 'Tijuana', miembros: 2 })
    expect(result[2]).toEqual({ ciudad: 'Mexicali', miembros: 1 })
  })

  it('debe limitar resultados a 10 ubicaciones', () => {
    const members = Array.from({ length: 15 }, (_, i) => ({
      Location: `Ciudad${i}`,
    }))

    const result = computeLocations(members)

    expect(result).toHaveLength(10)
  })

  it('debe manejar ubicaciones vacías como "Desconocida"', () => {
    const members = [
      { Location: '' },
      { Location: null },
      { Location: undefined },
    ]

    const result = computeLocations(members)

    expect(result).toHaveLength(1)
    expect(result[0].ciudad).toBe('Desconocida')
    expect(result[0].miembros).toBe(3)
  })

  it('debe manejar arreglo vacío', () => {
    const result = computeLocations([])

    expect(result).toEqual([])
  })
})

describe('computeTopContributors', () => {
  it('debe retornar los top contribuidores ordenados por eventos', () => {
    const members = [
      { Name: 'Alice', 'Events attended': '10' },
      { Name: 'Bob', 'Events attended': '5' },
      { Name: 'Charlie', 'Events attended': '15' },
      { Name: 'David', 'Events attended': '0' },
    ]

    const result = computeTopContributors(members, 10)

    expect(result).toHaveLength(3)
    expect(result[0].Name).toBe('Charlie')
    expect(result[0]['Events attended']).toBe('15')
    expect(result[1].Name).toBe('Alice')
    expect(result[2].Name).toBe('Bob')
  })

  it('debe filtrar miembros sin eventos', () => {
    const members = [
      { Name: 'Alice', 'Events attended': '0' },
      { Name: 'Bob', 'Events attended': '0' },
      { Name: 'Charlie', 'Events attended': '5' },
    ]

    const result = computeTopContributors(members, 10)

    expect(result).toHaveLength(1)
    expect(result[0].Name).toBe('Charlie')
  })

  it('debe respetar el límite n especificado', () => {
    const members = Array.from({ length: 20 }, (_, i) => ({
      Name: `Member${i}`,
      'Events attended': String(i + 1),
    }))

    const result = computeTopContributors(members, 5)

    expect(result).toHaveLength(5)
  })

  it('debe usar 10 como límite por defecto', () => {
    const members = Array.from({ length: 15 }, (_, i) => ({
      Name: `Member${i}`,
      'Events attended': String(i + 1),
    }))

    const result = computeTopContributors(members)

    expect(result).toHaveLength(10)
  })

  it('debe manejar arreglo vacío', () => {
    const result = computeTopContributors([])

    expect(result).toEqual([])
  })

  it('no debe mutar el arreglo original', () => {
    const members = [
      { Name: 'Alice', 'Events attended': '10' },
      { Name: 'Bob', 'Events attended': '5' },
    ]
    const original = [...members]

    computeTopContributors(members)

    expect(members).toEqual(original)
  })
})

describe('computeEventAttendance', () => {
  it('debe agrupar asistentes por fecha', () => {
    const members = [
      { 'Last Attended': '2024-01-15' },
      { 'Last Attended': '2024-01-15' },
      { 'Last Attended': '2024-02-10' },
    ]

    const result = computeEventAttendance(members)

    expect(result).toHaveLength(2)
    expect(result[0].asistentes).toBe(2)
    expect(result[1].asistentes).toBe(1)
  })

  it('debe ordenar por fecha ascendente', () => {
    const members = [
      { 'Last Attended': '2024-03-15T12:00:00' },
      { 'Last Attended': '2024-01-10T12:00:00' },
      { 'Last Attended': '2024-02-20T12:00:00' },
    ]

    const result = computeEventAttendance(members)

    expect(result[0].fechaCompleta).toBe('2024-01-10')
    expect(result[1].fechaCompleta).toBe('2024-02-20')
    expect(result[2].fechaCompleta).toBe('2024-03-15')
  })

  it('debe ignorar fechas inválidas o vacías', () => {
    const members = [
      { 'Last Attended': '2024-01-15' },
      { 'Last Attended': '' },
      { 'Last Attended': 'invalid-date' },
      { 'Last Attended': null },
    ]

    const result = computeEventAttendance(members)

    expect(result).toHaveLength(1)
    expect(result[0].asistentes).toBe(1)
  })

  it('debe incluir fechaCompleta en formato YYYY-MM-DD', () => {
    const members = [{ 'Last Attended': '2024-01-15T12:00:00' }]

    const result = computeEventAttendance(members)

    expect(result[0].fechaCompleta).toBe('2024-01-15')
  })

  it('debe manejar arreglo vacío', () => {
    const result = computeEventAttendance([])

    expect(result).toEqual([])
  })
})
