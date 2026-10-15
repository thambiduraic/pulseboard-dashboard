import { customers, products, subscriptions, transactions } from '../data/index'
import { toDateKey } from '../utils/date'
import type { DatePreset, DateRange, Subscription } from '../types'

export function rangeForPreset(preset: DatePreset, now = new Date()): DateRange {
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (preset === '7d' ? 6 : preset === '30d' ? 29 : 89))
  return { start, end, label: preset === '7d' ? 'Last 7 days' : preset === '30d' ? 'Last 30 days' : 'Last 90 days' }
}

export function getPreviousRange(range: DateRange): DateRange {
  const duration = Math.floor((range.end.getTime() - range.start.getTime()) / 86_400_000) + 1
  const end = new Date(range.start)
  end.setMilliseconds(end.getMilliseconds() - 1)
  const start = new Date(end)
  start.setDate(start.getDate() - duration + 1)
  start.setHours(0, 0, 0, 0)
  return { start, end, label: 'Previous period' }
}

export function filterByRange<T>(records: T[], range: DateRange, dateOf: (record: T) => string = (record) => (record as { date: string }).date): T[] {
  return records.filter((record) => {
    const value = new Date(`${dateOf(record)}T12:00:00`)
    return value >= range.start && value <= range.end
  })
}

export function calculateRevenue(range: DateRange): number {
  return filterByRange(transactions, range)
    .filter((transaction) => transaction.status === 'paid')
    .reduce((total, transaction) => total + transaction.amount, 0)
}

export function calculateMrr(): number {
  return subscriptions
    .filter((subscription) => subscription.status === 'active')
    .reduce((total, subscription) => total + subscription.monthlyAmount, 0)
}

export function escapeCsvValue(value: string): string {
  return `"${value.replaceAll('"', '""')}"`
}

export function getDashboardMetrics(range: DateRange) {
  const previous = getPreviousRange(range)
  const currentTransactions = filterByRange(transactions, range)
  const previousTransactions = filterByRange(transactions, previous)
  const currentCustomers = filterByRange(customers, range, (customer) => customer.createdAt)
  const previousCustomers = filterByRange(customers, previous, (customer) => customer.createdAt)
  const currentSubscriptions = filterByRange(subscriptions, range, (subscription) => subscription.startedAt)
  const currentRevenue = currentTransactions.filter((transaction) => transaction.status === 'paid').reduce((sum, transaction) => sum + transaction.amount, 0)
  const previousRevenue = previousTransactions.filter((transaction) => transaction.status === 'paid').reduce((sum, transaction) => sum + transaction.amount, 0)
  const activeAt = (date: string) => subscriptions.filter((subscription) => (
    subscription.startedAt <= date
    && (subscription.status === 'active' || (subscription.status === 'cancelled' && subscription.cancelledAt !== undefined && subscription.cancelledAt > date))
  ))
  const activeAtStart = activeAt(toDateKey(range.start))
  const previousActiveAtStart = activeAt(toDateKey(previous.start))
  const activeSubscriptions = activeAt(toDateKey(range.end))
  const previousActive = activeAt(toDateKey(previous.end))
  const cancelledSubscriptions = subscriptions.filter((subscription): subscription is Subscription & { cancelledAt: string } => subscription.cancelledAt !== undefined)
  const currentCancelled = filterByRange(cancelledSubscriptions, range, (subscription) => subscription.cancelledAt).length
  const previousCancelled = filterByRange(cancelledSubscriptions, previous, (subscription) => subscription.cancelledAt).length
  const churnRate = activeAtStart.length ? (currentCancelled / activeAtStart.length) * 100 : 0
  const previousChurn = previousActiveAtStart.length ? (previousCancelled / previousActiveAtStart.length) * 100 : 0
  const recurringRevenueAt = (date: string) => activeAt(date)
    .filter((subscription) => subscription.status === 'active' || subscription.cancelledAt !== undefined)
    .reduce((sum, subscription) => sum + subscription.monthlyAmount, 0)
  const mrr = recurringRevenueAt(toDateKey(range.end))
  const previousMrr = recurringRevenueAt(toDateKey(previous.end))
  const currentPaidTransactions = currentTransactions.filter((transaction) => transaction.status === 'paid')
  const previousPaidTransactions = previousTransactions.filter((transaction) => transaction.status === 'paid')
  const averageTransaction = currentPaidTransactions.length ? currentRevenue / currentPaidTransactions.length : 0
  const previousAverageTransaction = previousPaidTransactions.length ? previousRevenue / previousPaidTransactions.length : 0
  const dayCount = Math.max(1, Math.floor((range.end.getTime() - range.start.getTime()) / 86_400_000) + 1)
  const daily = Array.from({ length: dayCount }, (_, offset) => {
    const date = new Date(range.start)
    date.setDate(date.getDate() + offset)
    const key = toDateKey(date)
    const dailyTransactions = currentTransactions.filter((transaction) => transaction.date === key && transaction.status === 'paid')
    return {
      date: key,
      revenue: dailyTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
      customers: currentCustomers.filter((customer) => customer.createdAt === key).length,
    }
  })
  return {
    revenue: currentRevenue,
    revenueChange: percentageChange(currentRevenue, previousRevenue),
    customerCount: customers.filter((customer) => customer.createdAt <= toDateKey(range.end)).length,
    customerChange: percentageChange(currentCustomers.length, previousCustomers.length),
    newCustomers: currentCustomers.length,
    activeSubscriptions: activeSubscriptions.length,
    subscriptionChange: percentageChange(activeSubscriptions.length, previousActive.length),
    churnRate,
    churnChange: percentageChange(churnRate, previousChurn),
    mrr,
    mrrChange: percentageChange(mrr, previousMrr),
    averageTransaction,
    averageTransactionChange: percentageChange(averageTransaction, previousAverageTransaction),
    subscriptionMix: products.map((product) => ({
      id: product.id,
      name: product.name,
      color: product.color,
      count: activeSubscriptions.filter((subscription) => subscription.planId === product.id).length,
    })),
    daily,
    rangeDays: dayCount,
    periodSubscriptionCount: currentSubscriptions.length,
    previousPeriodActive: previousActive.length,
  }
}

function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}
