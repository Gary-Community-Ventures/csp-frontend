export function formatAmount(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export function dollarToCents(dollars: string | number): number {
  const parsed = typeof dollars === 'string' ? parseFloat(dollars) : dollars
  return Math.round(parsed * 100)
}

export function centsToDollar(cents: number): number {
  return cents / 100
}
