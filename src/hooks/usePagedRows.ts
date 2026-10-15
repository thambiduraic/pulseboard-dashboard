import { useState } from 'react'

export function usePagedRows<T>(rows: T[], pageSize = 7) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  return { page: currentPage, pageCount, pageRows, setPage, pageSize }
}
