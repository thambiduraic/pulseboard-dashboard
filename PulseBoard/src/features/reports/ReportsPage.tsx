import { useMemo, useState } from 'react'
import { CalendarDays, Check, Download, FileBarChart } from 'lucide-react'
import { CardHeading, DropdownSelect, PageHeader } from '../../components/ui'
import { reportOptions } from '../../components/ui/options'
import { DataTable } from '../../components/tables'
import { customers, products, subscriptions, transactions } from '../../data/index'
import { escapeCsvValue, filterByRange } from '../../services/analytics'
import { shortDate } from '../../utils/format'
import { toDateKey } from '../../utils/date'
import type { DateRange } from '../../types'

export function ReportsPage({ range }: { range: DateRange }) {
  const [report, setReport] = useState<'revenue' | 'customers' | 'subscriptions'>('revenue')
  const [notice, setNotice] = useState('')
  const [exportError, setExportError] = useState('')
  const rows = useMemo(() => {
    if (report === 'revenue') return filterByRange(transactions, range).map((item) => [item.id, item.date, customers.find((customer) => customer.id === item.customerId)?.name ?? '', products.find((product) => product.id === item.productId)?.name ?? '', item.status, item.amount.toFixed(2)])
    if (report === 'customers') return filterByRange(customers, range, (customer) => customer.createdAt).map((item) => [item.id, item.name, item.email, item.company, item.status, item.createdAt])
    return filterByRange(subscriptions, range, (subscription) => subscription.startedAt).map((item) => [item.id, customers.find((customer) => customer.id === item.customerId)?.name ?? '', products.find((product) => product.id === item.planId)?.name ?? '', item.status, item.monthlyAmount.toFixed(2), item.startedAt])
  }, [report, range])
  const headers = report === 'revenue' ? ['Reference', 'Date', 'Customer', 'Product', 'Status', 'Amount (USD)'] : report === 'customers' ? ['ID', 'Name', 'Email', 'Company', 'Status', 'Joined'] : ['ID', 'Customer', 'Plan', 'Status', 'Monthly amount (USD)', 'Started']
  function exportCsv() {
    setNotice('')
    setExportError('')
    try {
      const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\r\n')
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
      const urlApi = URL
      const url = urlApi.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pulseboard-${report}-${toDateKey(range.start)}-to-${toDateKey(range.end)}.csv`
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => urlApi.revokeObjectURL(url), 1000)
      setNotice(`${rows.length} ${report} records exported to CSV.`)
    } catch (error) {
      console.error('Unable to generate the selected PulseBoard CSV export.', error)
      setExportError('CSV export could not be generated. Please try again.')
    }
  }
  return (
    <>
      <PageHeader eyebrow="YOUR DATA, YOUR WAY" title="Reports" description="Build and export a clean snapshot of your business." />
      <section className="reports-layout">
        <article className="card report-config">
          <span className="report-icon"><FileBarChart size={21} /></span>
          <h2>Build a report</h2>
          <p>Choose a dataset to review and download a CSV for the selected date range.</p>
          <div className="form-label">Report category</div>
          <DropdownSelect label="Report category" value={report} options={reportOptions} className="dropdown-select-full" icon={<FileBarChart size={15} />} onChange={(value) => { setReport(value as typeof report); setNotice(''); setExportError('') }} />
          <div className="report-period"><CalendarDays size={16} /><span>{shortDate.format(range.start)} – {shortDate.format(range.end)}</span></div>
          <div className="report-ready"><Check size={16} /><span>{rows.length} records ready to export</span></div>
          <button type="button" className="button button-primary button-full" onClick={exportCsv} disabled={rows.length === 0}><Download size={16} />Download CSV</button>
          {notice && <p className="inline-success" role="status"><Check size={15} />{notice}</p>}
          {exportError && <p className="form-message form-error" role="alert">{exportError}</p>}
        </article>
        <article className="card report-preview">
          <CardHeading title="Report preview" detail={`${headers.length} columns · ${rows.length} rows`} />
          <DataTable<string[]>
            columns={headers.slice(0, 5).map((header, index) => ({ key: header, label: header, render: (row) => <span className="preview-cell">{row[index]}</span> }))}
            rows={rows.slice(0, 6)}
            getKey={(row) => row[0]}
            emptyTitle="No records in this range"
            emptyMessage="Choose a wider date range to include more data in the report."
          />
          <div className="preview-foot">Preview shows up to 6 rows. The CSV contains all {rows.length} matching records.</div>
        </article>
      </section>
    </>
  )
}
