import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './app/App'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  vi.unstubAllGlobals()
})

describe('PulseBoard application', () => {
  it('keeps the sidebar focused on navigation and account controls', () => {
    render(<App />)

    expect(screen.queryByText('About this demo')).toBeNull()
    expect(screen.queryByText('Northstar Studio')).toBeNull()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Open settings' })).toBeTruthy()
  })

  it('navigates between workspace pages without reloading', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('link', { name: 'Revenue' }))

    expect(screen.getByRole('heading', { level: 1, name: 'Revenue' })).toBeTruthy()
    expect(screen.getByText(/no payments are processed/i)).toBeTruthy()
  })

  it('applies the shared date range to the revenue page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Revenue' }))
    const dateRange = screen.getByRole('button', { name: 'Workspace date range' })
    await user.click(dateRange)
    await user.click(screen.getByRole('option', { name: 'Last 90 days' }))
    const ninetyDayRows = screen.getByText(/Showing.*of/).textContent
    await user.click(dateRange)
    await user.click(screen.getByRole('option', { name: 'Last 7 days' }))
    const sevenDayRows = screen.getByText(/Showing.*of/).textContent

    expect(ninetyDayRows).not.toBe(sevenDayRows)
    expect(dateRange.textContent).toMatch(/Last 7 days/)
  })

  it('opens and navigates the date-range menu using the keyboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Workspace date range' })
    trigger.focus()
    await user.keyboard('{ArrowDown}')

    expect(screen.getByRole('listbox', { name: 'Choose workspace date range' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Last 30 days' })).toBe(document.activeElement)
    await user.keyboard('{ArrowDown}{Enter}')
    expect(trigger.textContent).toMatch(/Last 90 days/)
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('searches customer records and opens a customer detail dialog', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Customers' }))
    await user.type(screen.getByPlaceholderText('Search customers...'), 'Olivia')

    const customerTable = screen.getByRole('table')
    expect(within(customerTable).getAllByRole('button', { name: /Olivia Rhye/ }).length).toBe(2)
    expect(screen.queryByText('Phoenix Baker')).toBeNull()

    await user.click(within(customerTable).getAllByRole('button', { name: /Olivia Rhye/ })[0])
    expect(screen.getByRole('dialog', { name: /Olivia Rhye/ })).toBeTruthy()
    expect(within(screen.getByRole('dialog')).getByText('Untitled UI')).toBeTruthy()
  })

  it('filters subscriptions by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Subscriptions' }))
    await user.click(screen.getByRole('button', { name: 'Filter subscriptions by status' }))
    await user.click(screen.getByRole('option', { name: 'Past due' }))

    const table = screen.getByRole('table')
    expect(within(table).getAllByText('past due').length).toBeGreaterThan(0)
    expect(within(table).queryByText('active')).toBeNull()
  })

  it('sorts revenue transactions and paginates the filtered result set', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Revenue' }))
    await user.click(screen.getByRole('button', { name: 'Workspace date range' }))
    await user.click(screen.getByRole('option', { name: 'Last 90 days' }))
    const table = screen.getByRole('table')
    const firstReference = () => within(table).getAllByRole('row')[1].querySelector('td')?.textContent
    const newestFirst = firstReference()
    await user.click(screen.getByRole('button', { name: /Date/ }))
    expect(firstReference()).not.toBe(newestFirst)

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByText(/Page 2 of/)).toBeTruthy()
  })

  it('validates and saves browser-local profile preferences', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: 'Settings' }))
    await user.clear(screen.getByLabelText('Full name'))
    await user.click(screen.getByRole('button', { name: 'Save preferences' }))
    expect(screen.getByRole('alert').textContent).toMatch(/enter your name/i)

    await user.type(screen.getByLabelText('Full name'), 'Alex Morgan')
    await user.click(screen.getByRole('button', { name: 'Save preferences' }))
    expect(screen.getByRole('status').textContent).toMatch(/saved/i)
    expect(JSON.parse(window.localStorage.getItem('pulseboard-preferences') ?? '{}').email).toBe('alex@northstar.io')

    await user.clear(screen.getByLabelText('Full name'))
    await user.type(screen.getByLabelText('Full name'), 'Taylor Quinn')
    await user.click(screen.getByRole('button', { name: 'Save preferences' }))
    expect(screen.getAllByText('Taylor Quinn').length).toBeGreaterThan(0)
  })

  it('shows a useful not-found page and returns to the overview', async () => {
    window.history.pushState({}, '', '/missing')
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: "We couldn't find that page." })).toBeTruthy()
    await user.click(screen.getByRole('link', { name: 'Back to overview' }))
    expect(await screen.findByRole('heading', { name: /Good morning/ })).toBeTruthy()
  })

  it('closes the mobile navigation after a route is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Open navigation' }))
    const drawer = document.querySelector('.sidebar-open')
    expect(drawer).not.toBeNull()

    await user.click(screen.getByRole('link', { name: 'Products' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Products' })).toBeTruthy()
    expect(document.querySelector('.sidebar-open')).toBeNull()
  })

  it('opens transaction details from the revenue table', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('link', { name: 'Revenue' }))

    const transaction = screen.getByRole('button', { name: 'inv_0024' })
    await user.click(transaction)
    expect(screen.getByRole('dialog', { name: 'inv_0024' })).toBeTruthy()
    expect(screen.getByText(/Fictional demo transaction/)).toBeTruthy()
    const closeButton = screen.getByRole('button', { name: 'Close details' })
    expect(document.activeElement).toBe(closeButton)
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('creates and downloads a CSV from the selected report data', async () => {
    const user = userEvent.setup()
    const createObjectURL = vi.fn(() => 'blob:pulseboard-report')
    const revokeObjectURL = vi.fn()
    const BrowserUrl = class extends URL {}
    Object.assign(BrowserUrl, { createObjectURL, revokeObjectURL })
    vi.stubGlobal('URL', BrowserUrl)
    const clickLink = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    render(<App />)
    await user.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('link', { name: /Reports/ }))
    await user.click(screen.getByRole('button', { name: 'Report category' }))
    await user.click(screen.getByRole('option', { name: 'New customers' }))
    expect(screen.getByText(/records ready to export/).textContent).toMatch(/^9 records/)
    await user.click(screen.getByRole('button', { name: 'Download CSV' }))

    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(clickLink).toHaveBeenCalledOnce()
    expect(screen.getByRole('status').textContent).toMatch(/customers records exported to CSV/i)
  })
})
