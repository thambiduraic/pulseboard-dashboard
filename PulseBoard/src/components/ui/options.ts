import { products } from '../../data/index'

export const dateRangeOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
] as const

export const transactionStatusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'refunded', label: 'Refunded' },
] as const

export const customerStatusOptions = [
  { value: 'all', label: 'All customers' },
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'past_due', label: 'Past due' },
  { value: 'churned', label: 'Churned' },
] as const

export const subscriptionStatusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'trial', label: 'Trial' },
  { value: 'past_due', label: 'Past due' },
  { value: 'cancelled', label: 'Cancelled' },
] as const

export const subscriptionPlanOptions = [
  { value: 'all', label: 'All plans' },
  ...products.map((product) => ({ value: product.id, label: product.name })),
]

export const reportOptions = [
  { value: 'revenue', label: 'Revenue transactions' },
  { value: 'customers', label: 'New customers' },
  { value: 'subscriptions', label: 'New subscriptions' },
] as const
