export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'cancelled'
export type TransactionStatus = 'paid' | 'pending' | 'refunded'
export type DatePreset = '7d' | '30d' | '90d'

export interface DateRange {
  start: Date
  end: Date
  label: string
}

export interface Product {
  id: string
  name: string
  tier: string
  description: string
  monthlyPrice: number
  color: string
}

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  createdAt: string
  status: 'active' | 'trial' | 'past_due' | 'churned'
  planId: string
  avatarColor: number
}

export interface Subscription {
  id: string
  customerId: string
  planId: string
  status: SubscriptionStatus
  startedAt: string
  renewalDate: string
  monthlyAmount: number
  cancelledAt?: string
}

export interface Transaction {
  id: string
  customerId: string
  productId: string
  date: string
  amount: number
  status: TransactionStatus
}

export interface ActivityEvent {
  id: string
  kind: 'payment' | 'customer' | 'product'
  message: string
  detail: string
  time: string
}
