import { LayoutDashboard, Search } from 'lucide-react'
import { NavLink } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="not-found card">
      <span className="empty-icon"><Search size={22} /></span>
      <div className="eyebrow">404 · PAGE NOT FOUND</div>
      <h1>We couldn't find that page.</h1>
      <p>The page may have moved, or the address might be incorrect.</p>
      <NavLink className="button button-primary" to="/dashboard"><LayoutDashboard size={16} />Back to overview</NavLink>
    </div>
  )
}
