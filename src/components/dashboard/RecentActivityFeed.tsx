import { ArrowRight, CreditCard, Sparkles, Users } from 'lucide-react'
import { NavLink } from 'react-router'
import { CardHeading } from '../ui'
import type { ActivityEvent } from '../../types'

export function RecentActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <article className="card activity-card">
      <CardHeading title="Recent activity" detail="Latest updates from your workspace" />
      <div className="activity-list">
        {events.slice(0, 5).map((item) => (
          <div className="activity-item" key={item.id}>
            <span className={`activity-icon activity-${item.kind}`}>{item.kind === 'payment' ? <CreditCard size={15} /> : item.kind === 'customer' ? <Users size={15} /> : <Sparkles size={15} />}</span>
            <div><p>{item.message}</p><span>{item.detail}</span></div>
            <time>{item.time}</time>
          </div>
        ))}
      </div>
      <NavLink className="activity-link" to="/analytics">View activity <ArrowRight size={14} /></NavLink>
    </article>
  )
}
