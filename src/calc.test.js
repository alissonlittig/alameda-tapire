import { test, expect } from 'vitest'
import { simular } from './calc.js'
test('parcela Price conhecida', () => {
  const r = simular({ valor: 100000, entradaPct: 20, anos: 1, taxaAnual: 0 })
  expect(r.entrada).toBe(20000)
  expect(r.parcela).toBeCloseTo(80000 / 12, 6)
})
test('juros aumentam o total', () => {
  const a = simular({ valor: 500000, entradaPct: 30, anos: 20, taxaAnual: 10 })
  expect(a.total).toBeGreaterThan(500000)
  expect(a.financiado).toBe(350000)
})
