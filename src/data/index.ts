import type { Product, Customer, Subscription, Transaction, ActivityEvent, SubscriptionStatus, TransactionStatus } from '../types'
import { dateForDaysAgo } from '../utils/date'

export const products: Product[] = [
  { id: 'starter', name: 'Starter', tier: 'Essential', description: 'Everything you need to get your business moving.', monthlyPrice: 29, color: '#8b82e6' },
  { id: 'growth', name: 'Growth', tier: 'Popular', description: 'More room to grow with powerful collaboration tools.', monthlyPrice: 79, color: '#6558d3' },
  { id: 'scale', name: 'Scale', tier: 'Advanced', description: 'Advanced insights and support for growing teams.', monthlyPrice: 149, color: '#3e9f88' },
  { id: 'enterprise', name: 'Enterprise', tier: 'Custom', description: 'Flexible capabilities for established organizations.', monthlyPrice: 299, color: '#e4a64d' },
]

const customerSeed: Omit<Customer, 'createdAt'>[] = [
  { id: 'cus_001', name: 'Olivia Rhye', email: 'olivia@untitledui.com', company: 'Untitled UI', status: 'active', planId: 'growth', avatarColor: 1 },
  { id: 'cus_002', name: 'Phoenix Baker', email: 'phoenix@acme.io', company: 'Acme Inc.', status: 'active', planId: 'enterprise', avatarColor: 2 },
  { id: 'cus_003', name: 'Lana Steiner', email: 'lana@layers.co', company: 'Layers', status: 'trial', planId: 'starter', avatarColor: 3 },
  { id: 'cus_004', name: 'Demi Wilkinson', email: 'demi@circooles.com', company: 'Circooles', status: 'active', planId: 'scale', avatarColor: 4 },
  { id: 'cus_005', name: 'Candice Wu', email: 'candice@catalog.app', company: 'Catalog', status: 'past_due', planId: 'growth', avatarColor: 5 },
  { id: 'cus_006', name: 'Natali Craig', email: 'natali@quotient.co', company: 'Quotient', status: 'active', planId: 'enterprise', avatarColor: 6 },
  { id: 'cus_007', name: 'Drew Cano', email: 'drew@circooles.com', company: 'Circooles', status: 'active', planId: 'starter', avatarColor: 7 },
  { id: 'cus_008', name: 'Orlando Diggs', email: 'orlando@hourglass.app', company: 'Hourglass', status: 'churned', planId: 'growth', avatarColor: 8 },
  { id: 'cus_009', name: 'Andi Lane', email: 'andi@command.com', company: 'Command+R', status: 'active', planId: 'scale', avatarColor: 9 },
  { id: 'cus_010', name: 'Kate Morrison', email: 'kate@layers.co', company: 'Layers', status: 'trial', planId: 'starter', avatarColor: 10 },
  { id: 'cus_011', name: 'Sarah Chen', email: 'sarah@figma.com', company: 'Figma', status: 'active', planId: 'enterprise', avatarColor: 11 },
  { id: 'cus_012', name: 'James Okafor', email: 'james@linear.app', company: 'Linear', status: 'active', planId: 'growth', avatarColor: 12 },
  { id: 'cus_013', name: 'Avery Johnson', email: 'avery@notion.so', company: 'Notion', status: 'active', planId: 'scale', avatarColor: 1 },
  { id: 'cus_014', name: 'Noah Williams', email: 'noah@loom.com', company: 'Loom', status: 'active', planId: 'growth', avatarColor: 2 },
  { id: 'cus_015', name: 'Mia Patel', email: 'mia@webflow.com', company: 'Webflow', status: 'active', planId: 'enterprise', avatarColor: 3 },
  { id: 'cus_016', name: 'Ethan Brooks', email: 'ethan@framer.com', company: 'Framer', status: 'past_due', planId: 'scale', avatarColor: 4 },
  { id: 'cus_017', name: 'Isabella Kim', email: 'isabella@vercel.com', company: 'Vercel', status: 'active', planId: 'growth', avatarColor: 5 },
  { id: 'cus_018', name: 'Lucas Martin', email: 'lucas@stripe.com', company: 'Stripe', status: 'active', planId: 'starter', avatarColor: 6 },
  { id: 'cus_019', name: 'Amara Okeke', email: 'amara@intercom.io', company: 'Intercom', status: 'trial', planId: 'scale', avatarColor: 7 },
  { id: 'cus_020', name: 'Leo Fischer', email: 'leo@linear.app', company: 'Linear', status: 'active', planId: 'growth', avatarColor: 8 },
  { id: 'cus_021', name: 'Zara Ahmed', email: 'zara@figma.com', company: 'Figma', status: 'active', planId: 'enterprise', avatarColor: 9 },
  { id: 'cus_022', name: 'Theo Nguyen', email: 'theo@notion.so', company: 'Notion', status: 'active', planId: 'starter', avatarColor: 10 },
  { id: 'cus_023', name: 'Grace Liu', email: 'grace@webflow.com', company: 'Webflow', status: 'churned', planId: 'scale', avatarColor: 11 },
  { id: 'cus_024', name: 'Max Turner', email: 'max@loom.com', company: 'Loom', status: 'active', planId: 'growth', avatarColor: 12 },
]

export const customers: Customer[] = customerSeed.map((customer, index) => ({
  ...customer,
  createdAt: dateForDaysAgo([122, 118, 107, 102, 91, 87, 76, 68, 63, 54, 49, 42, 35, 31, 28, 24, 21, 18, 15, 12, 10, 7, 100, 2][index]),
}))

const renewalDate = dateForDaysAgo(-15)
export const subscriptions: Subscription[] = customers.map((customer, index) => {
  const product = products.find((item) => item.id === customer.planId)
  const status: SubscriptionStatus = customer.status === 'churned' ? 'cancelled' : customer.status
  return {
    id: `sub_${String(index + 1).padStart(3, '0')}`,
    customerId: customer.id,
    planId: customer.planId,
    status,
    startedAt: customer.createdAt,
    renewalDate,
    monthlyAmount: product?.monthlyPrice ?? 0,
    ...(status === 'cancelled' ? { cancelledAt: dateForDaysAgo(index === 22 ? 4 : 50) } : {}),
  }
})

const transactionAmounts: Record<string, number> = { starter: 29, growth: 79, scale: 149, enterprise: 299 }
export const transactions: Transaction[] = customers.flatMap((customer, index) => {
  const amount = transactionAmounts[customer.planId] ?? 29
  const initialStatus: TransactionStatus = customer.status === 'past_due' ? 'pending' : customer.status === 'churned' ? 'refunded' : 'paid'
  const initial = {
    id: `inv_${String(index + 1).padStart(4, '0')}`,
    customerId: customer.id,
    productId: customer.planId,
    date: customer.createdAt,
    amount,
    status: initialStatus,
  }
  if (index % 3 === 0 && customer.status === 'active') {
    return [
      initial,
      {
        id: `inv_${String(index + 25).padStart(4, '0')}`,
        customerId: customer.id,
        productId: customer.planId,
        date: dateForDaysAgo(Math.max(0, [84, 74, 61, 52, 45, 38, 27, 19][index % 8])),
        amount,
        status: 'paid' as const,
      },
    ]
  }
  return [initial]
}).sort((a, b) => b.date.localeCompare(a.date))

export const activity: ActivityEvent[] = [
  { id: 'act_01', kind: 'payment', message: 'New payment received', detail: '$299.00 · Phoenix Baker', time: '12 min ago' },
  { id: 'act_02', kind: 'customer', message: 'New customer joined', detail: 'Max Turner · Growth plan', time: '48 min ago' },
  { id: 'act_03', kind: 'product', message: 'Subscription renewed', detail: '$149.00 · Andi Lane', time: '2 hours ago' },
  { id: 'act_04', kind: 'payment', message: 'Payment received', detail: '$79.00 · James Okafor', time: '3 hours ago' },
  { id: 'act_05', kind: 'customer', message: 'Trial started', detail: 'Mia Patel · Enterprise plan', time: '5 hours ago' },
  { id: 'act_06', kind: 'product', message: 'Plan upgraded', detail: 'Olivia Rhye · Growth plan', time: 'Yesterday' },
]
