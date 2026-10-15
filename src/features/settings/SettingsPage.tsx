import { useState, type FormEvent } from 'react'
import { Check, CircleHelp, Settings as SettingsIcon } from 'lucide-react'
import { CardHeading, PageHeader } from '../../components/ui'
import { initials } from '../../utils'
import { defaultPreferences, preferencesKey, readPreferences, type Preferences } from './preferences'

export function SettingsPage({
  onCompactChange,
  onPreferencesChange,
}: {
  onCompactChange: (enabled: boolean) => void
  onPreferencesChange: (preferences: Preferences) => void
}) {
  const [preferences, setPreferences] = useState<Preferences>(readPreferences)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  function update<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPreferences((current) => ({ ...current, [key]: value }))
    setNotice('')
    setError('')
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!preferences.name.trim() || !preferences.email.trim() || !preferences.email.includes('@') || !preferences.workspace.trim()) {
      setError('Enter your name, a valid email address, and workspace name.')
      setNotice('')
      return
    }
    try {
      localStorage.setItem(preferencesKey, JSON.stringify(preferences))
      onCompactChange(preferences.compactMode)
      onPreferencesChange(preferences)
      setNotice('Your local preferences have been saved.')
      setError('')
    } catch (caught) {
      console.error('Unable to save local PulseBoard preferences.', caught)
      setError('Could not save preferences in this browser. Check your browser storage settings.')
      setNotice('')
    }
  }
  function reset() {
    setPreferences(defaultPreferences)
    onCompactChange(false)
    try {
      localStorage.removeItem(preferencesKey)
      setNotice('Preferences reset to defaults.')
      onPreferencesChange(defaultPreferences)
      setError('')
    } catch (caught) {
      console.error('Unable to reset local PulseBoard preferences.', caught)
      setError('Could not reset preferences in this browser.')
      setNotice('')
    }
  }
  return (
    <>
      <PageHeader eyebrow="WORKSPACE PREFERENCES" title="Settings" description="Manage your profile and local display preferences." />
      <form className="settings-layout" onSubmit={save}>
        <div className="settings-main">
          <article className="card settings-card">
            <CardHeading title="Profile" detail="Your personal details for this workspace" />
            <div className="settings-profile"><span className="avatar avatar-large avatar-2">{initials(preferences.name || 'Alex Morgan')}</span><div><strong>{preferences.name || 'Your name'}</strong><span>Workspace administrator</span></div></div>
            <div className="form-grid">
              <label className="form-label">Full name<input className="form-input" value={preferences.name} onChange={(event) => update('name', event.target.value)} /></label>
              <label className="form-label">Email address<input className="form-input" type="email" value={preferences.email} onChange={(event) => update('email', event.target.value)} /></label>
            </div>
          </article>
          <article className="card settings-card">
            <CardHeading title="Workspace" detail="Basic information about your organization" />
            <label className="form-label workspace-field">Workspace name<input className="form-input" value={preferences.workspace} onChange={(event) => update('workspace', event.target.value)} /></label>
            <div className="local-note"><CircleHelp size={16} /><span>This is a local demo. Workspace changes are saved only in this browser and aren't synced with a server.</span></div>
          </article>
          <article className="card settings-card">
            <CardHeading title="Preferences" detail="Choose what you'd like to see and hear about" />
            <ToggleRow title="Weekly summary" description="A sample weekly activity digest preference." checked={preferences.weeklySummary} onChange={(value) => update('weeklySummary', value)} />
            <ToggleRow title="Product updates" description="A sample preference for new feature announcements." checked={preferences.productUpdates} onChange={(value) => update('productUpdates', value)} />
            <ToggleRow title="Compact dashboard" description="Reduce spacing in data tables and cards." checked={preferences.compactMode} onChange={(value) => update('compactMode', value)} />
          </article>
          {(error || notice) && <div className={error ? 'form-message form-error' : 'form-message form-success'} role={error ? 'alert' : 'status'}>{error || notice}</div>}
          <div className="settings-actions"><button type="button" className="button button-secondary" onClick={reset}>Reset to defaults</button><button type="submit" className="button button-primary"><Check size={16} />Save preferences</button></div>
        </div>
        <aside className="settings-aside card"><span className="aside-icon"><SettingsIcon size={19} /></span><h2>Local preferences</h2><p>Profile and display preferences are saved in this browser only. No sensitive data is stored, and changes do not sync across devices.</p><span className="local-only-tag"><span /> Browser only</span></aside>
      </form>
    </>
  )
}

export function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="toggle-row">
      <span><strong>{title}</strong><small>{description}</small></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  )
}
