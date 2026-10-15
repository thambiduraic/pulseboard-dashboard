export type Preferences = {
  name: string
  email: string
  workspace: string
  weeklySummary: boolean
  productUpdates: boolean
  compactMode: boolean
}

export const defaultPreferences: Preferences = {
  name: 'Alex Morgan',
  email: 'alex@northstar.io',
  workspace: 'Northstar Studio',
  weeklySummary: true,
  productUpdates: false,
  compactMode: false,
}

export const preferencesKey = 'pulseboard-preferences'

export function readPreferences(): Preferences {
  try {
    const stored = localStorage.getItem(preferencesKey)
    if (!stored) return defaultPreferences
    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed !== 'object' || parsed === null) return defaultPreferences
    const value = parsed as Partial<Preferences>
    return {
      name: typeof value.name === 'string' ? value.name : defaultPreferences.name,
      email: typeof value.email === 'string' ? value.email : defaultPreferences.email,
      workspace: typeof value.workspace === 'string' ? value.workspace : defaultPreferences.workspace,
      weeklySummary: typeof value.weeklySummary === 'boolean' ? value.weeklySummary : defaultPreferences.weeklySummary,
      productUpdates: typeof value.productUpdates === 'boolean' ? value.productUpdates : defaultPreferences.productUpdates,
      compactMode: typeof value.compactMode === 'boolean' ? value.compactMode : defaultPreferences.compactMode,
    }
  } catch (error) {
    console.error('Unable to read local PulseBoard preferences.', error)
    return defaultPreferences
  }
}
