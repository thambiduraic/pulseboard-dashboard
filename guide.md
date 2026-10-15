
# PulseBoard — Antigravity Implementation Guide

## 1. Role and Responsibility

Act as a Senior Frontend Engineer, Software Architect, UI/UX Engineer, and QA Engineer.

Your responsibility is to build the complete PulseBoard application by following this guide.

Do not generate only a visual mockup or static dashboard. Build a functional, responsive, maintainable React application that can be demonstrated to freelance clients and frontend engineering recruiters.

## 2. Project Overview

- **Project name:** PulseBoard
- **Project type:** Premium SaaS analytics dashboard
- **Primary goal:** Demonstrate professional frontend engineering skills.
- **Target audience:** SaaS founders, business owners, startups, digital agencies, freelance clients, and recruiters.

### Product Vision

PulseBoard is a fictional SaaS analytics platform that helps business owners understand revenue, customers, subscriptions, and product performance through a centralized dashboard.

The application must look and behave like a credible commercial SaaS product rather than a generic admin template.

### Core Priorities

1. Premium visual design and information hierarchy.
2. Functional interactions instead of decorative controls.
3. Maintainable React architecture.
4. Responsive desktop, tablet, and mobile layouts.
5. Strong TypeScript practices.
6. Accessible components.
7. Consistent and reliable analytics.
8. Testing and portfolio readiness.

## 3. Inspect Before Implementation

Before modifying the repository:

1. Inspect the project directory and existing files.
2. Read `package.json` and relevant configuration files.
3. Identify the existing framework, dependencies, and scripts.
4. Inspect current pages, components, and styling.
5. Identify implemented functionality and missing features.
6. Check for existing tests and TypeScript configuration.
7. Report important conflicts before making destructive changes.

### Repository Rules

- Preserve existing working functionality.
- Reuse appropriate existing components.
- Do not create a duplicate project inside the repository.
- Do not replace configuration without understanding its purpose.
- Do not install unnecessary dependencies.
- Do not overwrite environment files.
- Do not expose secrets or credentials.
- If the project is empty, initialize it using the recommended stack.
- After inspection, provide a concise plan and proceed with implementation.

## 4. Technology Stack

For a new project, use:

- React
- TypeScript with strict checking
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide React
- Vitest
- React Testing Library
- Playwright when practical

For an existing project, adapt to its compatible technology stack rather than replacing working dependencies without justification.

### Initial Scope

Build a frontend-only application using realistic, deterministic fictional data.

Do not add authentication, a backend, payment processing, or external integrations unless explicitly requested.

Keep the data layer modular so future backend integration is possible.

## 5. Visual Design System

Create a premium B2B SaaS interface.

### Design Direction

- Restrained indigo or blue accents.
- Neutral backgrounds and white surfaces.
- Clear typography and readable data.
- Consistent spacing and border radii.
- Subtle borders and shadows.
- Professional charts and tables.
- Clear active, hover, focus, and disabled states.
- Restrained animations.
- Consistent responsive behavior.

### Design Rules

- Establish reusable design tokens.
- Use a consistent typography scale.
- Maintain a clear visual hierarchy.
- Reuse shared components.
- Use color purposefully.
- Avoid excessive gradients, glassmorphism, decorative animation, and unnecessary visual effects.
- Avoid generic templates and inconsistent card designs.
- Prioritize usability over decoration.
- Respect reduced-motion preferences.

## 6. Application Shell

Build a shared application layout containing:

- Sidebar navigation.
- Top navigation bar.
- Main content area.
- Page headings and descriptions.
- Contextual actions.
- Responsive navigation behavior.

### Required Navigation

1. Overview
2. Analytics
3. Revenue
4. Customers
5. Subscriptions
6. Products
7. Reports
8. Settings

### Navigation Requirements

- Every navigation link must work.
- Active routes must be visually identifiable.
- Use Lucide icons consistently.
- Support keyboard navigation.
- Provide accessible labels.
- Use a mobile navigation drawer.
- Use React Router for internal navigation.
- Avoid unnecessary full-page reloads.

Only display topbar controls that have meaningful implemented behavior.

## 7. Required Pages

### 7.1 Overview Dashboard

**Route:** `/dashboard`

Implement:

- Revenue KPI.
- Total customers KPI.
- Active subscriptions KPI.
- Churn rate KPI.
- Revenue trend chart.
- Customer growth chart.
- Subscription distribution chart.
- Recent transactions table.
- Recent activity feed.
- Date-range selector.
- Previous-period comparisons.

All metrics and charts must use the shared data layer.

Calculate comparisons from actual seed data rather than arbitrary percentages.

### 7.2 Analytics

**Route:** `/analytics`

Implement:

- Revenue analysis.
- Customer acquisition trends.
- Subscription performance.
- Product performance.
- Date-range filters.
- Interactive chart tooltips.
- Relevant comparisons.
- Empty states.

### 7.3 Revenue

**Route:** `/revenue`

Implement:

- Revenue summary.
- Recurring revenue summary.
- Revenue trend chart.
- Transaction table.
- Search.
- Status filters.
- Sorting.
- Pagination.
- Transaction details.

Do not imply that fictional transactions represent actual payment processing.

### 7.4 Customers

**Route:** `/customers`

Implement:

- Customer summary.
- New customer metrics.
- Search.
- Status filters.
- Sortable customer table.
- Pagination.
- Customer detail drawer or dialog.
- Subscription and activity information.

### 7.5 Subscriptions

**Route:** `/subscriptions`

Implement:

- Active subscription count.
- Trial subscription count.
- Cancelled subscription count.
- Past-due subscription count.
- Monthly recurring revenue.
- Subscription distribution.
- Search and filters.
- Plan filters.
- Subscription detail views.

Use clearly defined subscription statuses and consistent business rules.

### 7.6 Products

**Route:** `/products`

Implement:

- Product or plan overview.
- Plan pricing.
- Subscriber counts.
- Revenue contribution.
- Product comparisons.
- Product search or sorting where appropriate.
- Product detail views.

Derive metrics from shared data wherever possible.

### 7.7 Reports

**Route:** `/reports`

Implement:

- Report categories.
- Date-range selection.
- Relevant charts and tables.
- CSV export.
- Export feedback.
- Empty states.

CSV export must generate an actual file from the selected dataset.

Escape commas, quotes, and newlines correctly.

### 7.8 Settings

**Route:** `/settings`

Implement:

- Profile preferences.
- Workspace information.
- Display preferences.
- Notification preferences.
- Theme selection if implemented.
- Save and reset actions.

Use local persistence for appropriate non-sensitive preferences.

Clearly distinguish local-only settings from settings that would require a backend.

### 7.9 Not Found

Implement a useful fallback page for invalid routes with a working action to return to the dashboard.

## 8. Data Architecture

Create a centralized, typed data layer.

Define suitable TypeScript models for:

- Customers.
- Products.
- Subscriptions.
- Transactions.
- Activity events.
- Analytics metrics.
- Date ranges.
- Dashboard summaries.

### Data Rules

- Use fictional seed data.
- Use stable identifiers.
- Keep currency and date formatting consistent.
- Reuse records across pages.
- Avoid duplicated hardcoded metrics.
- Separate calculations from presentation components.
- Make seed data deterministic.
- Keep business calculations testable.
- Document metrics that cannot be derived from available records.

### Business Logic

Define each metric precisely.

Examples:

- Revenue must follow a defined transaction inclusion rule.
- Active subscriptions must follow the chosen status definition.
- Customer growth must use consistent comparison periods.
- Churn rate must have a documented formula and denominator.
- Recurring revenue must not be calculated by blindly summing all transactions.

If a metric cannot be calculated reliably, add the necessary seed data or label the metric as illustrative.

Keep charts, tables, and KPI cards consistent with the same underlying records.

## 9. Functional Interaction Requirements

Every visible interactive control must have a meaningful behavior.

### Search

- Search the relevant records.
- Update displayed results.
- Support clearing the query.
- Show an empty state when no records match.

### Filtering

- Implement applicable status filters.
- Implement plan filters.
- Implement date-range filters for supported analytics.
- Allow filters to work together.
- Provide a reset action.

### Sorting

- Sort relevant columns.
- Handle strings, numbers, and dates correctly.
- Clearly indicate the current sort direction.

### Pagination

- Display the correct records.
- Change pages correctly.
- Reset pagination when filters invalidate the current page.
- Handle empty results safely.

### Date Ranges

Provide suitable presets:

- Last 7 days.
- Last 30 days.
- Last 90 days.
- Custom range if implemented.

Changing the date range must update the relevant data, not merely change the displayed label.

### Dialogs and Drawers

- Open and close correctly.
- Display meaningful information.
- Include accessible titles.
- Support keyboard interaction.
- Manage focus appropriately.
- Avoid empty detail views.

### Forms

- Validate inputs.
- Display useful errors.
- Prevent invalid submissions.
- Preserve values after validation failures.
- Provide accurate success or failure feedback.

### Notifications

Use a reusable notification system for meaningful actions.

Never report success when an operation has not succeeded.

### CSV Export

- Generate a real file.
- Include column headers.
- Escape CSV values correctly.
- Use meaningful filenames.
- Respect active filters when exporting filtered results.

## 10. React Architecture

Use a maintainable, feature-oriented architecture.

Recommended structure:

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── components/
│   ├── layout/
│   ├── ui/
│   ├── charts/
│   ├── tables/
│   └── dashboard/
├── features/
│   ├── overview/
│   ├── analytics/
│   ├── revenue/
│   ├── customers/
│   ├── subscriptions/
│   ├── products/
│   ├── reports/
│   └── settings/
├── data/
├── services/
├── hooks/
├── types/
├── utils/
├── styles/
├── assets/
└── main.tsx
```

Adapt the structure to the existing repository. Do not create empty files or unnecessary abstractions.

### Engineering Rules

- Use strict TypeScript.
- Avoid `any` unless justified.
- Use explicit, typed component props.
- Keep components focused.
- Separate business logic from presentation.
- Avoid duplicated state.
- Avoid unnecessary effects.
- Use stable React keys.
- Keep routing consistent.
- Centralize formatting utilities.
- Use semantic HTML.
- Introduce global state management only when justified.

## 11. Responsive Design

Support the following approximate viewport widths:

| Device | Width |
|---|---:|
| Small mobile | 320px |
| Standard mobile | 375px |
| Large mobile | 430px |
| Tablet | 768px |
| Laptop | 1024px |
| Desktop | 1440px |

### Mobile Requirements

- Convert the sidebar into a navigation drawer.
- Adapt KPI cards to the available width.
- Keep charts readable.
- Use horizontal table scrolling or a suitable mobile layout.
- Ensure dialogs fit the viewport.
- Keep controls touch-friendly.
- Prevent filters from overflowing.
- Allow page headings to wrap.
- Avoid unintended horizontal page scrolling.

Do not merely shrink the desktop interface.

## 12. Accessibility

Follow WCAG 2.2 AA practices wherever practical.

Implement:

- Semantic HTML.
- Logical heading hierarchy.
- Explicit input labels.
- Visible keyboard focus.
- Keyboard-accessible menus.
- Accessible dialog behavior.
- Correct button types.
- Sufficient color contrast.
- Useful error messages.
- Non-color indicators for statuses.
- Reduced-motion support.

Do not rely on color alone to communicate meaning.

## 13. Performance and Reliability

- Avoid unnecessary dependencies.
- Avoid redundant rendering work.
- Use responsive chart containers.
- Keep datasets manageable.
- Avoid excessive animations.
- Use code splitting when justified.
- Handle missing data safely.
- Avoid unhandled errors.
- Keep the application responsive.
- Measure performance before reporting performance scores.

## 14. Loading, Empty, and Error States

Implement suitable states for data-driven sections.

### Loading

Use loading indicators when an operation genuinely requires loading.

### Empty

Handle:

- No search results.
- No matching filters.
- No transactions.
- No data for the selected date range.

### Error

Display useful feedback when an operation fails.

Since the initial application uses local mock data, do not invent backend connection failures.

## 15. Security Requirements

- Do not expose secrets or private credentials.
- Do not commit secrets.
- Do not embed private API keys in browser code.
- Do not implement fake authentication security.
- Do not store sensitive data in local storage.
- Avoid unsafe HTML injection.
- Do not add real payment integrations without authorization.
- Treat browser-provided data as untrusted.
- Do not claim frontend checks provide backend security.

## 16. Testing Requirements

Testing is mandatory.

### Type Checking

Run the available TypeScript validation command and resolve errors.

### Linting

Run the available lint script and fix implementation-related issues.

### Unit Tests

Test:

- Revenue aggregation.
- Date filtering.
- Customer counts.
- Subscription counts.
- Percentage comparisons.
- Churn calculations if implemented.
- Sorting and filtering.
- CSV escaping.

### Component Tests

Test:

- Navigation.
- Search.
- Filters.
- Sorting.
- Pagination.
- Dialogs.
- Settings.
- CSV export.

### Browser Tests

Use Playwright when available and practical.

Test:

1. Opening the dashboard.
2. Navigating between pages.
3. Changing the date range.
4. Searching for a customer.
5. Filtering subscriptions.
6. Opening transaction details.
7. Exporting a report.
8. Saving a display preference.
9. Opening an invalid route.
10. Using mobile navigation.

Report any checks that could not be performed.

## 17. Implementation Phases

Follow this order.

### Phase 1 — Repository Inspection

Inspect the repository, dependencies, configuration, and existing functionality.

Report important conflicts or blockers.

### Phase 2 — Architecture and Planning

Prepare a practical implementation plan.

Identify reusable components and the implementation order.

### Phase 3 — Foundation

Implement or refine:

- Application entry point.
- Routing.
- Global styles.
- Design tokens.
- Application shell.
- Sidebar.
- Topbar.
- Shared UI components.
- Responsive layout.

Verify the foundation before proceeding.

### Phase 4 — Data Layer

Implement:

- Domain types.
- Fictional seed data.
- Data services.
- Business calculations.
- Date-range utilities.
- Formatting utilities.

Test important calculations.

### Phase 5 — Overview Dashboard

Implement KPI cards, charts, transactions, activity, and date-range behavior.

Verify that displayed metrics use the shared data layer.

### Phase 6 — Remaining Pages

Complete Analytics, Revenue, Customers, Subscriptions, Products, Reports, and Settings.

Implement all required interactions.

### Phase 7 — UI Polish

Refine visual consistency, accessibility, responsive behavior, transitions, and feedback.

### Phase 8 — Quality Assurance

Run available type checks, linting, unit tests, component tests, and browser tests.

Fix defects and verify critical workflows.

### Phase 9 — Documentation

Create or update the README with setup instructions, architecture, features, and known limitations.

Provide an accurate final implementation report.

Do not skip phases merely to finish faster.

## 18. Definition of Done

### Functionality

- [ ] All required routes render correctly.
- [ ] Navigation works on desktop and mobile.
- [ ] Metrics use consistent data.
- [ ] Date filters update relevant data.
- [ ] Search and filtering work.
- [ ] Sorting and pagination work.
- [ ] Detail views display meaningful information.
- [ ] CSV export generates a usable file.
- [ ] Settings behave as documented.
- [ ] Empty states are handled.
- [ ] No knowingly decorative primary controls remain.

### Engineering

- [ ] TypeScript errors are resolved.
- [ ] Linting passes where configured.
- [ ] Important calculations have tests.
- [ ] Key interactions have been tested.
- [ ] Shared components are reused appropriately.
- [ ] Data and presentation logic are separated.
- [ ] No secrets are exposed.
- [ ] Startup instructions are documented.

### Design

- [ ] Design tokens are consistent.
- [ ] Information hierarchy is clear.
- [ ] Charts and tables are readable.
- [ ] Mobile navigation works.
- [ ] Responsive behavior has been checked.
- [ ] Accessibility has been reviewed.
- [ ] No known critical layout defects remain.

### Delivery

- [ ] The application runs locally.
- [ ] Validation results are reported accurately.
- [ ] Incomplete features are disclosed.
- [ ] Mock data is identified as fictional.
- [ ] No unsupported claims are made.

## 19. Final Implementation Report

After implementation, provide the following.

### Features Completed

List completed pages and implemented interactions.

### Architecture

Explain the folder structure, routing, shared components, data layer, and state management.

### Files Changed

List the important files created or modified.

### Setup Instructions

Provide verified dependency installation and startup commands.

### Validation Results

Report the actual results of:

- Type checking.
- Linting.
- Unit tests.
- Component tests.
- Browser tests.
- Responsive checks.

Clearly identify checks that were not performed.

### Known Limitations

List incomplete features, unresolved defects, and future backend requirements.

### Recommended Next Steps

Identify the highest-value remaining improvement based on the actual project state.

## Final Directive

Read this guide completely before modifying the repository.

Inspect the existing project, prepare an implementation plan, and then build PulseBoard as a complete, cohesive, responsive React application.

Prioritize the application foundation and overview dashboard first, then complete every remaining required page.

**Do not stop at a static dashboard. Implement the interactions, verify the calculations, test the application, and report the actual implementation status honestly.**
