import { useMemo, useState } from 'react'
import { ArrowDownUp, ArrowRight, Check, Filter, Plus, Users, X } from 'lucide-react'
import { CardHeading, DropdownSelect, MetricCard, PageHeader, StatusBadge, TableSearch } from '../../components/ui'
import { customerStatusOptions } from '../../components/ui/options'
import { DataTable, Pagination } from '../../components/tables'
import { ModalDialog } from '../../components/ui/ModalDialog'
import { usePagedRows } from '../../hooks/usePagedRows'
import { customers, products, subscriptions, transactions } from '../../data/index'
import { filterByRange } from '../../services/analytics'
import { initials, money, shortDate } from '../../utils'
import type { Customer, DateRange } from '../../types'

export function CustomersPage({ range }: { range: DateRange }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | Customer['status']>('all')
  const [selected, setSelected] = useState<Customer | null>(null)
  const [sortField, setSortField] = useState<'name' | 'joined'>('joined')
  const [descending, setDescending] = useState(true)
  const filtered = useMemo(() => customers
    .filter((customer) => new Date(customer.createdAt) <= range.end)
    .filter((customer) => status === 'all' || customer.status === status)
    .filter((customer) => `${customer.name} ${customer.email} ${customer.company}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const compare = sortField === 'name' ? a.name.localeCompare(b.name) : a.createdAt.localeCompare(b.createdAt)
      return descending ? -compare : compare
    }), [range, status, search, sortField, descending])
  const page = usePagedRows(filtered)
  const newCustomers = filterByRange(customers, range, (customer) => customer.createdAt).length
  return (
    <>
      <PageHeader eyebrow="YOUR AUDIENCE" title="Customers" description="Get to know the people and teams behind your growth." action={<span className="demo-chip"><span /> Sample customer data</span>} />
      <section className="metrics-grid compact-metrics">
        <MetricCard label="Total customers" value={customers.length.toString()} caption="all time" icon={<Users size={17} />} />
        <MetricCard label="New this period" value={newCustomers.toString()} caption="selected date range" icon={<Plus size={17} />} />
        <MetricCard label="Active customers" value={customers.filter((customer) => customer.status === 'active').length.toString()} caption="currently active" icon={<Check size={17} />} />
      </section>
      <article className="card table-card full-table-card">
        <CardHeading title="Customer directory" detail={`${filtered.length} customer records`} />
        <div className="table-toolbar">
          <TableSearch value={search} onChange={(value) => { setSearch(value); page.setPage(1) }} placeholder="Search customers..." />
          <div className="toolbar-filters"><DropdownSelect label="Filter by customer status" value={status} options={customerStatusOptions} icon={<Filter size={15} />} onChange={(value) => { setStatus(value as 'all' | Customer['status']); page.setPage(1) }} /></div>
        </div>
        <DataTable<Customer>
          columns={[
            { key: 'name', label: <button type="button" className="sort-button" onClick={() => { setSortField('name'); setDescending(sortField === 'name' ? !descending : false) }}>Customer <ArrowDownUp size={13} /></button>, render: (customer) => <button className="customer-button" type="button" onClick={() => setSelected(customer)}><span className={`avatar avatar-${customer.avatarColor}`}>{initials(customer.name)}</span><span><strong>{customer.name}</strong><small>{customer.email}</small></span></button> },
            { key: 'company', label: 'Company', render: (customer) => customer.company },
            { key: 'plan', label: 'Plan', render: (customer) => products.find((product) => product.id === customer.planId)?.name ?? '—' },
            { key: 'joined', label: <button type="button" className="sort-button" onClick={() => { setSortField('joined'); setDescending(sortField === 'joined' ? !descending : true) }}>Date joined <ArrowDownUp size={13} /></button>, render: (customer) => shortDate.format(new Date(`${customer.createdAt}T12:00:00`)) },
            { key: 'status', label: 'Status', render: (customer) => <StatusBadge status={customer.status} /> },
            { key: 'details', label: '', align: 'right', render: (customer) => <button className="icon-button" type="button" aria-label={`View ${customer.name}`} onClick={() => setSelected(customer)}><ArrowRight size={16} /></button> },
          ]}
          rows={page.pageRows}
          getKey={(customer) => customer.id}
          emptyTitle="No customers found"
          emptyMessage="Try another search or clear the selected filters."
        />
        <Pagination page={page.page} pageCount={page.pageCount} total={filtered.length} pageSize={page.pageSize} onChange={page.setPage} />
      </article>
      {selected && <CustomerDialog customer={selected} onClose={() => setSelected(null)} />}
    </>
  )
}

function CustomerDialog({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const subscription = subscriptions.find((item) => item.customerId === customer.id)
  const plan = products.find((item) => item.id === customer.planId)
  return (
    <ModalDialog titleId="customer-title" onClose={onClose}>
        <div className="dialog-top"><div><span className="eyebrow">CUSTOMER PROFILE</span><h2 id="customer-title">{customer.name}</h2></div><button className="icon-button" type="button" aria-label="Close customer details" onClick={onClose}><X size={18} /></button></div>
        <div className="profile-hero"><span className={`avatar avatar-large avatar-${customer.avatarColor}`}>{initials(customer.name)}</span><div><strong>{customer.company}</strong><span>{customer.email}</span></div></div>
        <dl className="detail-list">
          <div><dt>Customer status</dt><dd><StatusBadge status={customer.status} /></dd></div>
          <div><dt>Current plan</dt><dd>{plan?.name ?? 'No plan'}</dd></div>
          <div><dt>Subscription</dt><dd>{subscription ? <StatusBadge status={subscription.status} /> : 'No subscription'}</dd></div>
          <div><dt>Joined</dt><dd>{shortDate.format(new Date(`${customer.createdAt}T12:00:00`))}</dd></div>
          <div><dt>Lifetime value</dt><dd>{money(transactions.filter((transaction) => transaction.customerId === customer.id && transaction.status === 'paid').reduce((sum, transaction) => sum + transaction.amount, 0))}</dd></div>
        </dl>
        <p className="dialog-note">Profile details are from fictional demo records stored locally in this application.</p>
    </ModalDialog>
  )
}
