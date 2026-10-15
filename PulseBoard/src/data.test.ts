import { describe, expect, it } from 'vitest'
import {
  calculateMrr,
  calculateRevenue,
  escapeCsvValue,
  filterByRange,
  getDashboardMetrics,
  getPreviousRange,
  rangeForPreset,
} from './services/analytics'
import { customers, products, subscriptions, transactions } from './data/index'
import { toDateKey } from './utils/date'
import type { DateRange } from './types'

describe('analytics data calculations', () => {
  it('includes only paid transactions when calculating net revenue', () => {
    const range: DateRange = {
      start: new Date('2000-01-01T00:00:00'),
      end: new Date('2100-01-01T23:59:59'),
      label: 'All time',
    }
    const expected = transactions
      .filter((transaction) => transaction.status === 'paid')
      .reduce((total, transaction) => total + transaction.amount, 0)

    expect(calculateRevenue(range)).toBe(expected)
    expect(expected).toBeGreaterThan(0)
  })

  it('calculates MRR from active subscriptions only', () => {
    const expected = subscriptions
      .filter((subscription) => subscription.status === 'active')
      .reduce((total, subscription) => total + subscription.monthlyAmount, 0)

    expect(calculateMrr()).toBe(expected)
  })

  it('filters records inclusively at both date boundaries', () => {
    const range: DateRange = {
      start: new Date('2026-10-01T00:00:00'),
      end: new Date('2026-10-07T23:59:59'),
      label: 'Test week',
    }
    const records = [{ date: '2026-09-30' }, { date: '2026-10-01' }, { date: '2026-10-07' }, { date: '2026-10-08' }]

    expect(filterByRange(records, range).map((record) => record.date)).toEqual(['2026-10-01', '2026-10-07'])
  })

  it('builds adjacent, equal-length date ranges for period comparisons', () => {
    const current = rangeForPreset('7d', new Date('2026-10-15T12:00:00'))
    const previous = getPreviousRange(current)

    expect(toDateKey(current.start)).toBe('2026-10-09')
    expect(toDateKey(current.end)).toBe('2026-10-15')
    expect(previous.end.getTime() + 1).toBe(current.start.getTime())
    expect(Math.round((current.end.getTime() - current.start.getTime()) / 86_400_000)).toBe(7)
    expect(Math.round((previous.end.getTime() - previous.start.getTime()) / 86_400_000)).toBe(7)
  })

  it('uses the selected and previous periods for acquisition comparisons', () => {
    const range = rangeForPreset('30d')
    const previous = getPreviousRange(range)
    const metrics = getDashboardMetrics(range)
    const currentAcquisitions = filterByRange(customers, range, (customer) => customer.createdAt).length
    const previousAcquisitions = filterByRange(customers, previous, (customer) => customer.createdAt).length

    expect(metrics.newCustomers).toBe(currentAcquisitions)
    expect(metrics.customerChange).toBe(
      previousAcquisitions === 0
        ? currentAcquisitions === 0 ? 0 : 100
        : ((currentAcquisitions - previousAcquisitions) / previousAcquisitions) * 100,
    )
  })

  it('calculates churn from cancellations in the period over the opening active base', () => {
    const range = rangeForPreset('30d')
    const metrics = getDashboardMetrics(range)
    const rangeStart = toDateKey(range.start)
    const openingBase = subscriptions.filter((subscription) => (
      subscription.startedAt <= rangeStart
      && (subscription.status === 'active' || (subscription.status === 'cancelled' && subscription.cancelledAt !== undefined && subscription.cancelledAt > rangeStart))
    )).length
    const cancellations = subscriptions.filter((subscription) => (
      subscription.cancelledAt !== undefined
      && filterByRange([{ date: subscription.cancelledAt }], range).length > 0
    )).length

    expect(metrics.churnRate).toBe(openingBase ? (cancellations / openingBase) * 100 : 0)
  })

  it('counts subscription mix consistently and sums daily chart revenue', () => {
    const range = rangeForPreset('90d')
    const metrics = getDashboardMetrics(range)
    const active = subscriptions.filter((subscription) => subscription.status === 'active')
    const paidRevenue = filterByRange(transactions, range)
      .filter((transaction) => transaction.status === 'paid')
      .reduce((sum, transaction) => sum + transaction.amount, 0)

    expect(metrics.activeSubscriptions).toBe(active.length)
    expect(metrics.subscriptionMix.reduce((sum, plan) => sum + plan.count, 0)).toBe(metrics.activeSubscriptions)
    expect(metrics.daily.reduce((sum, day) => sum + day.revenue, 0)).toBe(paidRevenue)
    expect(metrics.mrr).toBe(active.reduce((sum, subscription) => sum + subscription.monthlyAmount, 0))
    expect(products.length).toBeGreaterThan(0)
  })
})

describe('CSV serialization', () => {
  it('quotes every field and escapes commas, quotes, and line breaks', () => {
    expect(escapeCsvValue('plain text')).toBe('"plain text"')
    expect(escapeCsvValue('value, with comma')).toBe('"value, with comma"')
    expect(escapeCsvValue('say "hello"')).toBe('"say ""hello"""')
    expect(escapeCsvValue('first line\nsecond line')).toBe('"first line\nsecond line"')
  })
})
