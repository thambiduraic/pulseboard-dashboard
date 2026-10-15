import { Navigate, Route, Routes } from 'react-router'
import { AnalyticsPage } from '../features/analytics/AnalyticsPage'
import { CustomersPage } from '../features/customers/CustomersPage'
import { DashboardPage } from '../features/overview/OverviewPage'
import { ProductsPage } from '../features/products/ProductsPage'
import { ReportsPage } from '../features/reports/ReportsPage'
import { RevenuePage } from '../features/revenue/RevenuePage'
import { SettingsPage } from '../features/settings/SettingsPage'
import type { Preferences } from '../features/settings/preferences'
import { SubscriptionsPage } from '../features/subscriptions/SubscriptionsPage'
import { NotFoundPage } from '../components/layout/NotFoundPage'
import type { DatePreset, DateRange } from '../types'

export function AppRouter({ dateRange, datePreset, setDateRange, setDatePreset, onCompactChange, onPreferencesChange }: {
  dateRange: DateRange
  datePreset: DatePreset
  setDateRange: (range: DateRange) => void
  setDatePreset: (preset: DatePreset) => void
  onCompactChange: (enabled: boolean) => void
  onPreferencesChange: (preferences: Preferences) => void
}) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={<DashboardPage range={dateRange} setRange={setDateRange} preset={datePreset} setPreset={setDatePreset} />}
      />
      <Route path="/analytics" element={<AnalyticsPage range={dateRange} />} />
      <Route path="/revenue" element={<RevenuePage range={dateRange} />} />
      <Route path="/customers" element={<CustomersPage range={dateRange} />} />
      <Route path="/subscriptions" element={<SubscriptionsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/reports" element={<ReportsPage range={dateRange} />} />
      <Route
        path="/settings"
        element={<SettingsPage onCompactChange={onCompactChange} onPreferencesChange={onPreferencesChange} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
