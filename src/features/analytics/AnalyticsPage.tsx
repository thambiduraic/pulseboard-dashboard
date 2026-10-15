import { Suspense } from 'react'
import { Activity, ArrowUpRight, CreditCard, Users } from 'lucide-react'
import ChartIsland from '../../components/charts'
import { CardHeading, MetricCard, PageHeader } from '../../components/ui'
import { products, transactions } from '../../data/index'
import { filterByRange, getDashboardMetrics } from '../../services/analytics'
import { money } from '../../utils'
import type { DateRange } from '../../types'

export function AnalyticsPage({ range }: { range: DateRange }) {
  const metrics = getDashboardMetrics(range)
  const chartData = metrics.daily.map((point) => ({
    ...point,
    label: new Date(`${point.date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))
  const productData = products.map((product) => ({
    name: product.name,
    revenue: transactions
      .filter((transaction) => transaction.productId === product.id && transaction.status === 'paid' && filterByRange([transaction], range).length > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0),
    subscribers: metrics.subscriptionMix.find((plan) => plan.id === product.id)?.count ?? 0,
    color: product.color,
  }))
  return (
    <>
      <PageHeader eyebrow="PERFORMANCE" title="Analytics" description="Understand the trends shaping your business." />
      <section className="metrics-grid analytics-kpis">
        <MetricCard label="Net revenue" value={money(metrics.revenue)} change={metrics.revenueChange} caption="vs previous period" icon={<CreditCard size={17} />} />
        <MetricCard label="New customers" value={metrics.newCustomers.toString()} change={metrics.customerChange} caption="vs previous period" icon={<Users size={17} />} />
        <MetricCard label="Monthly recurring revenue" value={money(metrics.mrr)} change={metrics.mrrChange} caption="vs previous period" icon={<Activity size={17} />} />
        <MetricCard label="Avg. transaction" value={money(metrics.averageTransaction)} change={metrics.averageTransactionChange} caption="vs previous period" icon={<ArrowUpRight size={17} />} />
      </section>
      <section className="content-grid analytics-grid">
        <article className="card wide-chart-card">
          <CardHeading title="Revenue & customer growth" detail="Daily revenue alongside new customer signups" />
          <Suspense fallback={<div className="chart-wrap analytics-chart chart-loading" role="status">Loading chart...</div>}>
            <ChartIsland variant="analytics" data={chartData} />
          </Suspense>
          <div className="chart-legend"><span><i className="legend-dot purple" />Revenue</span><span><i className="legend-dot green" />New customers</span></div>
        </article>
        <article className="card product-performance-card">
          <CardHeading title="Product performance" detail="Net revenue by plan in the selected period" />
          <Suspense fallback={<div className="chart-wrap product-chart chart-loading" role="status">Loading chart...</div>}>
            <ChartIsland variant="products" data={productData} />
          </Suspense>
          <div className="performance-list">
            {productData.map((item) => <div key={item.name}><span><i style={{ background: item.color }} />{item.name}</span><strong>{item.subscribers} active</strong></div>)}
          </div>
        </article>
      </section>
    </>
  )
}
