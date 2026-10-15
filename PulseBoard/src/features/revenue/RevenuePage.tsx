import { useMemo, useState } from 'react'
import { Activity, ArrowDownUp, ArrowRight, CreditCard, Filter, X } from 'lucide-react'
import { CardHeading, DropdownSelect, MetricCard, PageHeader, StatusBadge, TableSearch } from '../../components/ui'
import { transactionStatusOptions } from '../../components/ui/options'
import { DataTable, Pagination } from '../../components/tables'
import { ModalDialog } from '../../components/ui/ModalDialog'
import { usePagedRows } from '../../hooks/usePagedRows'
import { customers, products, subscriptions, transactions } from '../../data/index'
import { filterByRange } from '../../services/analytics'
import { initials, money, preciseCurrency, shortDate } from '../../utils'
import type { DateRange, Transaction, TransactionStatus } from '../../types'

export function RevenuePage({ range }: { range: DateRange }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | TransactionStatus>('all')
  const [sortDescending, setSortDescending] = useState(true)
  const [selected, setSelected] = useState<Transaction | null>(null)
  const filtered = useMemo(() => transactions
    .filter((transaction) => filterByRange([transaction], range).length > 0)
    .filter((transaction) => status === 'all' || transaction.status === status)
    .filter((transaction) => {
      const customer = customers.find((item) => item.id === transaction.customerId)
      const value = `${transaction.id} ${customer?.name ?? ''} ${customer?.email ?? ''}`.toLowerCase()
      return value.includes(search.toLowerCase())
    })
    .sort((a, b) => sortDescending ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)), [range, search, status, sortDescending])
  const page = usePagedRows(filtered)
  const currentRevenue = filtered.filter((transaction) => transaction.status === 'paid').reduce((sum, transaction) => sum + transaction.amount, 0)
  const recurring = subscriptions.filter((subscription) => subscription.status === 'active').reduce((sum, subscription) => sum + subscription.monthlyAmount, 0)
  return (
    <>
      <PageHeader eyebrow="MONEY IN" title="Revenue" description="Track revenue trends and transaction activity. Demo data only; no payments are processed." />
      <section className="metrics-grid compact-metrics">
        <MetricCard label="Net revenue" value={money(currentRevenue)} caption="selected period" icon={<CreditCard size={17} />} />
        <MetricCard label="Monthly recurring revenue" value={money(recurring)} caption="active subscriptions" icon={<Activity size={17} />} />
        <MetricCard label="Transactions" value={filtered.length.toString()} caption="selected period" icon={<ArrowDownUp size={17} />} />
      </section>
      <article className="card table-card full-table-card">
        <CardHeading title="Transactions" detail="Search, filter, and inspect transaction records" action={<span className="demo-chip"><span /> Fictional dataset</span>} />
        <div className="table-toolbar">
          <TableSearch value={search} onChange={(value) => { setSearch(value); page.setPage(1) }} placeholder="Search transactions..." />
          <div className="toolbar-filters">
            <DropdownSelect label="Filter by status" value={status} options={transactionStatusOptions} icon={<Filter size={15} />} onChange={(value) => { setStatus(value as 'all' | TransactionStatus); page.setPage(1) }} />
            <button type="button" className="button button-secondary" onClick={() => setSortDescending((value) => !value)}><ArrowDownUp size={15} />Date {sortDescending ? '↓' : '↑'}</button>
          </div>
        </div>
        <DataTable<Transaction>
          columns={[
            { key: 'ref', label: 'Reference', render: (transaction) => <button type="button" className="table-link" onClick={() => setSelected(transaction)}>{transaction.id}</button> },
            { key: 'customer', label: 'Customer', render: (transaction) => {
              const customer = customers.find((item) => item.id === transaction.customerId)
              return <div className="person-cell"><span className={`avatar avatar-${customer?.avatarColor ?? 1}`}>{initials(customer?.name ?? 'NA')}</span><span><strong>{customer?.name}</strong><small>{customer?.email}</small></span></div>
            } },
            { key: 'product', label: 'Product', render: (transaction) => products.find((item) => item.id === transaction.productId)?.name ?? '—' },
            { key: 'date', label: 'Date', render: (transaction) => shortDate.format(new Date(`${transaction.date}T12:00:00`)) },
            { key: 'status', label: 'Status', render: (transaction) => <StatusBadge status={transaction.status} /> },
            { key: 'amount', label: 'Amount', align: 'right', render: (transaction) => <strong>{preciseCurrency.format(transaction.amount)}</strong> },
            { key: 'details', label: '', align: 'right', render: (transaction) => <button className="icon-button" type="button" aria-label={`View transaction ${transaction.id}`} onClick={() => setSelected(transaction)}><ArrowRight size={16} /></button> },
          ]}
          rows={page.pageRows}
          getKey={(transaction) => transaction.id}
          emptyTitle="No transactions found"
          emptyMessage="Try adjusting your search, status, or date range."
        />
        <Pagination page={page.page} pageCount={page.pageCount} total={filtered.length} pageSize={page.pageSize} onChange={page.setPage} />
      </article>
      <TransactionDialog transaction={selected} onClose={() => setSelected(null)} />
    </>
  )
}

export function TransactionDialog({ transaction, onClose }: { transaction: Transaction | null; onClose: () => void }) {
  if (!transaction) return null
  const customer = customers.find((item) => item.id === transaction.customerId)
  const product = products.find((item) => item.id === transaction.productId)
  return (
    <ModalDialog titleId="transaction-title" onClose={onClose}>
        <div className="dialog-top"><div><span className="eyebrow">TRANSACTION DETAILS</span><h2 id="transaction-title">{transaction.id}</h2></div><button className="icon-button" type="button" aria-label="Close details" onClick={onClose}><X size={18} /></button></div>
        <div className="dialog-amount">{preciseCurrency.format(transaction.amount)}</div>
        <StatusBadge status={transaction.status} />
        <dl className="detail-list">
          <div><dt>Customer</dt><dd>{customer?.name ?? 'Unknown'}</dd></div>
          <div><dt>Email</dt><dd>{customer?.email ?? '—'}</dd></div>
          <div><dt>Product</dt><dd>{product?.name ?? '—'}</dd></div>
          <div><dt>Date</dt><dd>{shortDate.format(new Date(`${transaction.date}T12:00:00`))}</dd></div>
          <div><dt>Reference</dt><dd>{transaction.id}</dd></div>
        </dl>
        <p className="dialog-note">Fictional demo transaction. PulseBoard does not process payments.</p>
    </ModalDialog>
  )
}
