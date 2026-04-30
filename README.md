# Ticktock Test App

A Next.js App Router application for timesheet management with protected dashboard routes, mocked API data, and credentials-based authentication.

## Tech Stack

- **Next.js** (App Router)
- **NextAuth.js** for authentication
- **Tailwind CSS** for styling
- **shadcn/ui** for reusable UI components
- **TypeScript**

## Folder Structure

```text
.
├─ public/
│  └─ mock/
│     └─ timesheets.json               # mock dataset used by timesheet APIs
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ auth/[...nextauth]/route.ts # NextAuth API handler
│  │  │  └─ timesheets/                 # mock timesheet API routes
│  │  ├─ dashboard/                     # protected dashboard routes/pages
│  │  ├─ login/                         # login page
│  │  ├─ layout.tsx                     # root layout
│  │  ├─ page.tsx                       # root page (redirect logic via proxy)
│  │  └─ providers.tsx                  # app-level providers
│  ├─ components/
│  │  ├─ features/                      # feature-specific components
│  │  ├─ layout/                        # header/footer and layout pieces
│  │  ├─ skeleton/                      # loading skeleton components
│  │  └─ ui/                            # shadcn/ui reusable primitives
│  ├─ lib/
│  │  ├─ auth.ts                        # NextAuth options and credential validation
│  │  ├─ timesheets-data-source.ts      # data access for timesheet APIs
│  │  └─ utils.ts                       # reusable helpers/utilities
│  ├─ types/                            # shared TypeScript types
│  └─ proxy.ts                          # route protection + redirect rules
└─ README.md
```

## Mock API Paths

The app exposes mocked timesheet APIs backed by local data:

- `GET /api/timesheets` — list timesheets
- `GET /api/timesheets/:id` — get a single timesheet detail
- NextAuth endpoint: `/api/auth/[...nextauth]`

The source JSON for mocked timesheet content is in `public/mock/timesheets.json`.

## Reusable Functions

Reusable logic lives in `src/lib/utils.ts`, including:

- date helpers (day/month keys and labels)
- date range and day formatting utilities
- JSON parsing/validation helpers for timesheet payloads
- `cn()` className helper (`clsx` + `tailwind-merge`) used across components

## `proxy.ts` (Routing and Access Control)

`src/proxy.ts` centralizes route access behavior:

- redirects `/` to `/dashboard` when authenticated, otherwise to `/login`
- blocks logged-in users from revisiting `/login`
- protects `/dashboard` and nested dashboard paths
- validates auth state using a verified NextAuth token (not only cookie existence)

## NextAuth Authentication

Authentication is configured in `src/lib/auth.ts` and wired through:

- `src/app/api/auth/[...nextauth]/route.ts`

Current setup:

- Credentials provider (dummy credentials for demo)
- JWT session strategy
- custom sign-in page at `/login`
- token/session callbacks include an `accessToken` in the session object

### Demo Login

- Email: `demo@example.com`
- Password: `password`

## CSRF Token and Cookie Expiration

NextAuth automatically manages CSRF protection for auth flows through its built-in CSRF token/cookie handling on `/api/auth/*` routes.

Session lifecycle and expiration are controlled by NextAuth's JWT/session configuration (and defaults unless explicitly overridden). If you need custom expiration windows, define them in the NextAuth `session`/`jwt` options.

## UI Components (shadcn/ui)

Reusable UI building blocks are in `src/components/ui` (e.g. button, input, table, dropdown, pagination, checkbox, label). These are used by feature components to keep styling and behavior consistent.

## Tailwind CSS Styling

Tailwind is used for utility-first styling across pages and components, with global styles in `src/app/globals.css`.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create environment variables (for example, in `.env.local`):

   ```bash
   NEXTAUTH_SECRET=your-secret
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.
