import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { EmptyState } from '../ui'

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onChange,
}: {
  page: number
  pageCount: number
  total: number
  pageSize: number
  onChange: (page: number) => void
}) {
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1
  const last = Math.min(page * pageSize, total)
  return (
    <div className="pagination">
      <span>Showing <strong>{first}–{last}</strong> of <strong>{total}</strong></span>
      <div className="pagination-buttons">
        <button type="button" className="icon-button" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={16} />
        </button>
        <span>Page {page} of {pageCount}</span>
        <button type="button" className="icon-button" aria-label="Next page" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

export function DataTable<T>({
  columns,
  rows,
  getKey,
  emptyTitle,
  emptyMessage,
}: {
  columns: { key: string; label: ReactNode; render: (row: T) => ReactNode; align?: 'right' }[]
  rows: T[]
  getKey: (row: T) => string
  emptyTitle: string
  emptyMessage: string
}) {
  if (rows.length === 0) return <EmptyState title={emptyTitle} message={emptyMessage} />
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column.key} className={column.align === 'right' ? 'align-right' : ''}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getKey(row)}>
              {columns.map((column) => <td key={column.key} className={column.align === 'right' ? 'align-right' : ''}>{column.render(row)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
