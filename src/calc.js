// Tabela Price: parcela fixa. Entrada em % do valor; taxa anual nominal convertida em mensal equivalente.
export function simular({ valor, entradaPct, anos, taxaAnual }) {
  const entrada = valor * entradaPct / 100
  const financiado = valor - entrada
  const n = anos * 12
  const i = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1
  const parcela = i === 0 ? financiado / n : financiado * i / (1 - Math.pow(1 + i, -n))
  return { entrada, financiado, parcela, total: entrada + parcela * n }
}
export const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
