const today = new Date()
today.setHours(12, 0, 0, 0)

export function dateForDaysAgo(days: number): string {
  const date = new Date(today)
  date.setDate(date.getDate() - days)
  return toDateKey(date)
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
