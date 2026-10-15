import { currency } from './format'
export { preciseCurrency, shortDate } from './format'
export { dateForDaysAgo, toDateKey } from './date'

export function money(value: number): string {
  return currency.format(value)
}

export function formatPercent(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
