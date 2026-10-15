import { useMemo, useState } from 'react'
import { Activity, ArrowRight, Check, CircleHelp, Filter, Sparkles, X } from 'lucide-react'
import { CardHeading, DropdownSelect, MetricCard, PageHeader, StatusBadge, TableSearch } from '../../components/ui'
import { subscriptionPlanOptions, subscriptionStatusOptions } from '../../components/ui/options'
import { DataTable, Pagination } from '../../components/tables'
import { ModalDialog } from '../../components/ui/ModalDialog'
import { usePagedRows } from '../../hooks/usePagedRows'
import { customers, products, subscriptions } from '../../data/index'
import { initials, money, shortDate } from '../../utils'
import type { Subscription, SubscriptionStatus } from '../../types'

export function SubscriptionsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | SubscriptionStatus>('all')
  const [planId, setPlanId] = useState('all')
  const [selected, setSelected] = useState<Subscription | null>(null)
  const filtered = useMemo(() => subscriptions
    .filter((subscription) => status === 'all' || subscription.status === status)
    .filter((subscription) => planId === 'all' || subscription.planId === planId)
    .filter((subscription) => {
      const customer = customers.find((item) => item.id === subscription.customerId)
      const plan = products.find((item) => item.id === subscription.planId)
      return `${customer?.name ?? ''} ${customer?.email ?? ''} ${plan?.name ?? ''}`.toLowerCase().includes(search.toLowerCase())
    })
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt)), [status, planId, search])
  const page = usePagedRows(filtered)
  const activeCount = subscriptions.filter((subscription) => subscription.status === 'active').length
  const mrr = subscriptions.filter((subscription) => subscription.status === 'active').reduce((sum, subscription) => sum + subscription.monthlyAmount, 0)
  return (
    <>
      <PageHeader eyebrow="RECURRING REVENUE" title="Subscriptions" description="Monitor plans, renewals, and customer subscription health." action={<span className="demo-chip"><span /> Demo records</span>} />
      <section className="metrics-grid subscription-kpis">
        <MetricCard label="Monthly recurring revenue" value={money(mrr)} caption="active subscriptions only" icon={<Activity size={17} />} />
        <MetricCard label="Active" value={activeCount.toString()} caption="currently subscribed" icon={<Check size={17} />} />
        <MetricCard label="Trial" value={subscriptions.filter((item) => item.status === 'trial').length.toString()} caption="in trial period" icon={<Sparkles size={17} />} />
        <MetricCard label="Needs attention" value={subscriptions.filter((item) => item.status === 'past_due').length.toString()} caption="past due" icon={<CircleHelp size={17} />} />
      </section>
      <article className="card table-card full-table-card">
        <CardHeading title="All subscriptions" detail={`${filtered.length} subscription records`} />
        <div className="table-toolbar">
          <TableSearch value={search} onChange={(value) => { setSearch(value); page.setPage(1) }} placeholder="Search subscriptions..." />
          <div className="toolbar-filters">
            <DropdownSelect label="Filter subscriptions by status" value={status} options={subscriptionStatusOptions} icon={<Filter size={15} />} onChange={(value) => { setStatus(value as 'all' | SubscriptionStatus); page.setPage(1) }} />
            <DropdownSelect label="Filter subscriptions by plan" value={planId} options={subscriptionPlanOptions} onChange={(value) => { setPlanId(value); page.setPage(1) }} />
          </div>
        </div>
        <DataTable<Subscription>
          columns={[
            { key: 'customer', label: 'Customer', render: (subscription) => {
              const customer = customers.find((item) => item.id === subscription.customerId)
              return <div className="person-cell"><span className={`avatar avatar-${customer?.avatarColor ?? 1}`}>{initials(customer?.name ?? 'NA')}</span><span><strong>{customer?.name ?? 'Unknown'}</strong><small>{customer?.email}</small></span></div>
            } },
            { key: 'plan', label: 'Plan', render: (subscription) => products.find((product) => product.id === subscription.planId)?.name ?? '—' },
            { key: 'started', label: 'Started', render: (subscription) => shortDate.format(new Date(`${subscription.startedAt}T12:00:00`)) },
            { key: 'status', label: 'Status', render: (subscription) => <StatusBadge status={subscription.status} /> },
            { key: 'amount', label: 'Monthly amount', align: 'right', render: (subscription) => <strong>{money(subscription.monthlyAmount)}<small className="table-subtext"> / month</small></strong> },
            { key: 'details', label: '', align: 'right', render: (subscription) => <button type="button" className="icon-button" aria-label="View subscription details" onClick={() => setSelected(subscription)}><ArrowRight size={16} /></button> },
          ]}
          rows={page.pageRows}
          getKey={(subscription) => subscription.id}
          emptyTitle="No subscriptions found"
          emptyMessage="Try a different plan, status, or search term."
        />
        <Pagination page={page.page} pageCount={page.pageCount} total={filtered.length} pageSize={page.pageSize} onChange={page.setPage} />
      </article>
      {selected && <SubscriptionDialog subscription={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function SubscriptionDialog({ subscription, onClose }: { subscription: Subscription; onClose: () => void }) {
  const customer = customers.find((item) => item.id === subscription.customerId)
  const plan = products.find((item) => item.id === subscription.planId)
  return (
    <ModalDialog titleId="subscription-title" onClose={onClose}>
        <div className="dialog-top"><div><span className="eyebrow">SUBSCRIPTION</span><h2 id="subscription-title">{subscription.id}</h2></div><button className="icon-button" type="button" aria-label="Close subscription details" onClick={onClose}><X size={18} /></button></div>
        <StatusBadge status={subscription.status} />
        <dl className="detail-list">
          <div><dt>Customer</dt><dd>{customer?.name ?? 'Unknown'}</dd></div>
          <div><dt>Plan</dt><dd>{plan?.name ?? '—'}</dd></div>
          <div><dt>Monthly amount</dt><dd>{money(subscription.monthlyAmount)}</dd></div>
          <div><dt>Started</dt><dd>{shortDate.format(new Date(`${subscription.startedAt}T12:00:00`))}</dd></div>
          <div><dt>Next renewal</dt><dd>{subscription.status === 'active' ? shortDate.format(new Date(`${subscription.renewalDate}T12:00:00`)) : '—'}</dd></div>
        </dl>
        <p className="dialog-note">Fictional subscription data. Changes require a backend and are not available in this demo.</p>
    </ModalDialog>
  )
}
