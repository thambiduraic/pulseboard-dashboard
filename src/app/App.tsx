import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import {
  Activity,
  ArrowDownUp,
  Bell,
  Box,
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Settings as SettingsIcon,
  Users,
  X,
} from 'lucide-react'
import { AppRouter } from './router'
import { AppProviders } from './providers'
import { DropdownSelect } from '../components/ui'
import { dateRangeOptions } from '../components/ui/options'
import { initials } from '../utils'
import { rangeForPreset } from '../services/analytics'
import { readPreferences, type Preferences } from '../features/settings/preferences'
import type { DatePreset } from '../types'
import '../styles/app.css'

const navItems = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', path: '/analytics', icon: Activity },
  { label: 'Revenue', path: '/revenue', icon: CreditCard },
  { label: 'Customers', path: '/customers', icon: Users },
  { label: 'Subscriptions', path: '/subscriptions', icon: ArrowDownUp },
  { label: 'Products', path: '/products', icon: Box },
  { label: 'Reports', path: '/reports', icon: FileBarChart },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
]

function AppShell() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [updatesSeen, setUpdatesSeen] = useState(false)
  const [profile, setProfile] = useState<Preferences>(readPreferences)
  const [compact, setCompact] = useState(profile.compactMode)
  const [datePreset, setDatePreset] = useState<DatePreset>('30d')
  const [dateRange, setDateRange] = useState(() => rangeForPreset('30d'))
  const location = useLocation()
  const activeNav = navItems.find((item) => location.pathname === item.path)

  return (
    <div className={`app-shell${compact ? ' compact-mode' : ''}`}>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" type="button" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar${mobileOpen ? ' sidebar-open' : ''}`}>
        <NavLink to="/dashboard" className="brand-lockup" aria-label="PulseBoard overview">
          <span className="brand-mark"><Activity size={19} strokeWidth={2.4} /></span>
          <span className="brand-name">pulse<span>board</span></span>
        </NavLink>
        <div className="nav-section-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item${isActive ? ' nav-item-active' : ''}`} aria-current={location.pathname === path ? 'page' : undefined}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Reports' && <span className="nav-new">NEW</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-user"><span className="avatar avatar-2">{initials(profile.name)}</span><span><strong>{profile.name}</strong><small>{profile.email}</small></span><button className="icon-button" type="button" aria-label="Open settings" onClick={() => { setMobileOpen(false); navigate('/settings') }}><MoreHorizontal size={17} /></button></div>
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <button type="button" className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
            <div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14} /><strong>{activeNav?.label ?? 'Page not found'}</strong></div>
          </div>
          <div className="topbar-actions">
            <DropdownSelect
              label="Workspace date range"
              value={datePreset}
              options={dateRangeOptions}
              icon={<CalendarDays size={15} />}
              className="topbar-date-range"
              onChange={(value) => {
                const next = value as DatePreset
                setDatePreset(next)
                setDateRange(rangeForPreset(next))
              }}
            />
            <button type="button" className={`icon-button notification-trigger${notificationOpen ? ' active' : ''}`} aria-label="Notifications and help" aria-expanded={notificationOpen} onClick={() => { setNotificationOpen((value) => !value); setUpdatesSeen(true) }}><Bell size={17} />{!updatesSeen && <i />}</button>
            <span className="avatar avatar-small avatar-2">{initials(profile.name)}</span>
          </div>
          {notificationOpen && <div className="notification-popover"><div className="popover-head"><strong>Workspace updates</strong><button type="button" className="icon-button" aria-label="Close updates" onClick={() => setNotificationOpen(false)}><X size={15} /></button></div><p><span className="notification-dot" />Your demo workspace is ready to explore.</p><p><span className="notification-dot muted" />Metrics use fictional sample data.</p><button type="button" className="text-link" onClick={() => setNotificationOpen(false)}>Got it <Check size={14} /></button></div>}
        </header>
        <main className="main-content">
          <div className="content-inner">
            <AppRouter
              dateRange={dateRange}
              datePreset={datePreset}
              setDateRange={setDateRange}
              setDatePreset={setDatePreset}
              onCompactChange={setCompact}
              onPreferencesChange={setProfile}
            />
            <footer className="app-footer"><span>© 2026 PulseBoard</span><span>Analytics for the next stage.</span><NavLink to="/settings">Settings</NavLink></footer>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return <AppProviders><AppShell /></AppProviders>
}
