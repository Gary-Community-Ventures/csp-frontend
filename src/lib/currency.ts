export function formatAmount(cents: number): string {
  const dollars = centsToDollar(cents)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return formatter.format(dollars)
}

export function dollarToCents(dollars: string | number): number {
  const parsed = typeof dollars === 'string' ? parseFloat(dollars) : dollars
  return Math.round(parsed * 100)
}

export function centsToDollar(cents: number): number {
  return cents / 100
}
