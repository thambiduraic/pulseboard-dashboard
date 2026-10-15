# PulseBoard

PulseBoard is a frontend-only SaaS analytics dashboard for a fictional workspace. Its responsive pages cover revenue, customers, subscriptions, products, reports, and local display preferences.

All records are deterministic fictional sample data. The application does not authenticate users, process payments, or connect to a backend.

## Run locally

```sh
npm install
npm run dev
```

The Vite server prints its local URL after startup.

## Validation

```sh
npm run build
npm run lint
npm test
```

## Structure

```text
src/
├── app/              # App entry, route map, and router provider
├── components/       # Shared layout, UI, charts, tables, and dashboard widgets
├── features/         # One module per product area and route
├── data/             # Typed fictional seed records
├── services/         # Date filtering, analytics, and business calculations
├── hooks/            # Shared React hooks
├── types/            # Shared domain models
├── utils/            # Date and formatting helpers
├── styles/           # Global and application styles
└── main.tsx          # Vite entry point
```

Each route is implemented in its corresponding `src/features/` directory. The route map in `src/app/router.tsx` composes those page modules inside the shared workspace shell. Common controls live in `src/components/ui/`, `src/components/tables/`, and `src/components/dashboard/`. Seed data, analytics calculations, types, and formatting utilities are kept separate from presentation.

- `src/data.test.ts` verifies revenue, MRR, date filtering, comparison periods, chart totals, and CSV escaping.
- `src/App.test.tsx` covers navigation, search, status filters, detail dialogs, settings persistence, not-found routing, and mobile navigation.

## Metrics and limitations

- Net revenue sums `paid` transaction records. `pending` and `refunded` transactions are excluded.
- Monthly recurring revenue sums the monthly prices of `active` subscriptions only; it does not infer recurring revenue from transaction history.
- Churn is cancellations recorded during the selected range divided by subscriptions active at the start of that range. The seed includes cancellation dates; it is still sample data rather than a full historical subscription-status ledger.
- Period comparisons use equal-length adjacent calendar-day ranges. Seed records are generated relative to the current date so date presets remain populated.
- Workspace, profile, and display preferences are stored in browser local storage only. They are non-sensitive demo values and do not sync with a server.
- CSV downloads contain the selected report category and date range, with properly quoted values.

## Routes

`/dashboard`, `/analytics`, `/revenue`, `/customers`, `/subscriptions`, `/products`, `/reports`, and `/settings` are supported. Unknown paths display a return-to-overview action.
