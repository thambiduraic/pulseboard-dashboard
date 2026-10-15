# PulseBoard

PulseBoard is a frontend-only SaaS analytics dashboard for a fictional workspace. Explore business metrics, revenue, customers, subscriptions, products, reports, and local display preferences.

**Live demo:** [pulseboard-dashboard-v01.netlify.app](https://pulseboard-dashboard-v01.netlify.app)

All records are deterministic fictional sample data. The application does not authenticate users, process payments, or connect to a backend.

## Features

- **Overview and analytics:** KPI cards, charts, and activity summaries.
- **Revenue:** Transaction metrics and date-filtered revenue details.
- **Customers and subscriptions:** Searchable, filterable, sortable, paginated tables and record details.
- **Products:** Product and plan summaries.
- **Reports:** Preview revenue, customer, or subscription records and download the selected date range as CSV.
- **Settings:** Update profile and workspace details and save display preferences in browser storage.
- **Responsive navigation:** Collapse the desktop sidebar to icons, or use the mobile navigation drawer.
- **Shared date range:** Apply date presets across dashboard pages.

## Tech stack

- React and TypeScript
- Vite
- React Router
- Recharts
- Lucide icons
- Vitest and Testing Library

## Run locally

### Prerequisites

- [Node.js](https://nodejs.org/) (with npm)

### Install and start

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

### Available commands

```sh
npm run build  # Type-check and create a production build in dist/
npm run lint   # Run ESLint
npm test       # Run the Vitest test suite
npm run preview # Preview the production build locally
```

## Routes

| Path | Page |
| --- | --- |
| `/dashboard` | Overview |
| `/analytics` | Analytics |
| `/revenue` | Revenue |
| `/customers` | Customers |
| `/subscriptions` | Subscriptions |
| `/products` | Products |
| `/reports` | Reports |
| `/settings` | Settings |

The root path redirects to `/dashboard`. Unknown paths show a not-found page with a link back to the overview.

## Project structure

```text
public/                 Static icons and brand assets
src/
├── app/                Application shell, providers, and route map
├── components/         Shared charts, tables, layout, and UI
├── data/               Fictional sample records
├── features/           Page modules organized by product area
├── hooks/              Shared React hooks
├── services/           Analytics calculations and date filtering
├── styles/             Global and application styles
├── types/              Shared TypeScript types
├── utils/              Date and formatting helpers
├── App.test.tsx        Application interaction tests
└── data.test.ts        Analytics and sample-data tests
```

## Demo data and limitations

- Net revenue sums `paid` transaction records. `pending` and `refunded` transactions are excluded.
- Monthly recurring revenue sums the monthly prices of `active` subscriptions only; it is not inferred from transaction history.
- Churn is cancellations recorded during the selected range divided by subscriptions active at the start of that range. The sample includes cancellation dates, but is not a complete historical subscription-status ledger.
- Period comparisons use equal-length adjacent calendar-day ranges. Seed records are generated relative to the current date so date presets remain populated.
- Workspace, profile, and display preferences are stored in browser local storage only. They are non-sensitive demo values and do not sync with a server.
- CSV downloads contain the selected report category and date range, with values escaped for CSV format.

PulseBoard is a portfolio demo, not a live analytics service. Backend integration and real authentication are not included.
