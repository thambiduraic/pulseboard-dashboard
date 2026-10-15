import { Suspense } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, CreditCard, Download, Users } from 'lucide-react'
import ChartIsland from '../../components/charts'
import { RecentActivityFeed } from '../../components/dashboard/RecentActivityFeed'
import { CardHeading, DropdownSelect, EmptyState, MetricCard, PageHeader, StatusBadge } from '../../components/ui'
import { dateRangeOptions } from '../../components/ui/options'
import { DataTable } from '../../components/tables'
import { activity, customers, transactions } from '../../data/index'
import { getDashboardMetrics, rangeForPreset } from '../../services/analytics'
import { formatPercent, initials, money, preciseCurrency, shortDate } from '../../utils'
import type { DatePreset, DateRange, Transaction } from '../../types'

export function DashboardPage({
  range,
  setRange,
  preset,
  setPreset,
}: {
  range: DateRange
  setRange: (range: DateRange) => void
  preset: DatePreset
  setPreset: (preset: DatePreset) => void
}) {
  const navigate = useNavigate()
  const metrics = getDashboardMetrics(range)
  const recentTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
  const chartData = metrics.daily.map((point) => ({
    ...point,
    label: new Date(`${point.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))
  const distribution = metrics.subscriptionMix.map((plan) => ({ name: plan.name, value: plan.count, color: plan.color }))

  function changePreset(next: DatePreset) {
    setPreset(next)
    setRange(rangeForPreset(next))
  }

  return (
    <>
      <PageHeader
        eyebrow={new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()).toUpperCase()}
        title="Good morning, Alex"
        description="Here's what's happening with your business today."
        action={<button type="button" className="button button-primary" onClick={() => navigate('/reports')}><Download size={16} />Export report</button>}
      />
      <section className="metrics-grid" aria-label="Key business metrics">
        <MetricCard label="Total revenue" value={money(metrics.revenue)} change={metrics.revenueChange} caption="vs previous period" icon={<CreditCard size={17} />} />
        <MetricCard label="Total customers" value={metrics.customerCount.toLocaleString()} change={metrics.customerChange} caption="vs previous period" icon={<Users size={17} />} />
        <MetricCard label="Active subscriptions" value={metrics.activeSubscriptions.toLocaleString()} change={metrics.subscriptionChange} caption="vs previous period" icon={<Activity size={17} />} />
        <MetricCard label="Churn rate" value={`${metrics.churnRate.toFixed(1)}%`} change={-metrics.churnChange} caption="vs previous period" icon={<ArrowDownRight size={17} />} />
      </section>

      <section className="content-grid dashboard-main-grid">
        <article className="card revenue-card">
          <CardHeading
            title="Revenue overview"
            detail="Net revenue from completed transactions"
            action={
              <DropdownSelect label="Revenue date range" value={preset} options={dateRangeOptions} icon={<CalendarDays size={15} />} onChange={(value) => changePreset(value as DatePreset)} />
            }
          />
          <div className="chart-summary">
            <strong>{money(metrics.revenue)}</strong>
            <span className={`summary-change ${metrics.revenueChange >= 0 ? 'text-positive' : 'text-negative'}`}>
              {metrics.revenueChange >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {formatPercent(metrics.revenueChange)}
            </span>
            <span>compared to previous period</span>
          </div>
          {chartData.length ? (
            <Suspense fallback={<div className="chart-wrap revenue-chart chart-loading" role="status">Loading chart...</div>}>
              <ChartIsland variant="revenue" data={chartData} />
            </Suspense>
          ) : <EmptyState title="No revenue in this period" message="Try a wider date range to see your revenue trend." />}
          <div className="chart-legend"><span><i className="legend-dot purple" />Revenue</span><span className="legend-period">{shortDate.format(range.start)} – {shortDate.format(range.end)}</span></div>
        </article>

        <article className="card distribution-card">
          <CardHeading title="Subscription mix" detail="Active subscribers by plan" />
          <Suspense fallback={<div className="distribution-chart chart-loading" role="status">Loading chart...</div>}>
            <ChartIsland variant="distribution" data={distribution} />
          </Suspense>
          <div className="plan-legend">
            {distribution.map((plan) => (
              <div key={plan.name}><span><i style={{ backgroundColor: plan.color }} />{plan.name}</span><strong>{plan.value}</strong></div>
            ))}
          </div>
        </article>
      </section>

      <section className="content-grid dashboard-bottom-grid">
        <article className="card table-card">
          <CardHeading title="Recent transactions" detail="A snapshot of your latest customer activity" action={<NavLink className="text-link" to="/revenue">View all <ArrowRight size={14} /></NavLink>} />
          <DataTable<Transaction>
            columns={[
              { key: 'customer', label: 'Customer', render: (transaction) => {
                const customer = customers.find((item) => item.id === transaction.customerId)
                return <div className="person-cell"><span className={`avatar avatar-${customer?.avatarColor ?? 1}`}>{initials(customer?.name ?? 'NA')}</span><span><strong>{customer?.name ?? 'Unknown customer'}</strong><small>{customer?.email}</small></span></div>
              } },
              { key: 'date', label: 'Date', render: (transaction) => shortDate.format(new Date(`${transaction.date}T12:00:00`)) },
              { key: 'amount', label: 'Amount', align: 'right', render: (transaction) => <strong>{preciseCurrency.format(transaction.amount)}</strong> },
              { key: 'status', label: 'Status', render: (transaction) => <StatusBadge status={transaction.status} /> },
            ]}
            rows={recentTransactions}
            getKey={(transaction) => transaction.id}
            emptyTitle="No recent transactions"
            emptyMessage="Transactions will appear here as they are recorded."
          />
        </article>
        <RecentActivityFeed events={activity} />
      </section>
    </>
  )
}
