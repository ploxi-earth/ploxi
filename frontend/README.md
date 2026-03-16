# Ploxi Frontend

Next.js 14 (App Router) frontend for the Ploxi platform.

## Setup

```bash
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev                         # http://localhost:3000
```

## Environment Variables

| Variable               | Default                       | Description         |
|------------------------|-------------------------------|---------------------|
| `NEXT_PUBLIC_API_URL`  | `http://localhost:5000/api`   | Backend API base URL|

## Routes

### Public
| Path                             | Auth | Description                          |
|----------------------------------|------|--------------------------------------|
| `/`                              | ─    | Home / landing page                  |
| `/corporate`                     | ─    | Corporate solution page              |
| `/corporate/register`            | ─    | Corporate 3-step enquiry form        |
| `/cleantech`                     | ─    | CleanTech solution page              |
| `/cleantech/registration`        | ─    | CleanTech 2-step registration        |
| `/climate-finance`               | ─    | Climate Finance page                 |
| `/climate-finance/registration`  | ─    | Climate Finance registration (`?type=`) |
| `/tools/ghg-calculator`          | ─    | GHG emissions calculator             |

### Auth
| Path                          | Auth    | Description         |
|-------------------------------|---------|---------------------|
| `/auth/login`                 | Guest   | Login               |
| `/auth/register`              | Guest   | Vendor self-register|
| `/auth/forgot-password`       | Guest   | Request reset link  |
| `/auth/reset-password/[token]`| Guest   | Set new password    |

### Admin Panel
| Path                                    | Role           |
|-----------------------------------------|----------------|
| `/admin`                                | platform_admin |
| `/admin/vendors`                        | platform_admin |
| `/admin/vendors/[id]`                   | platform_admin |
| `/admin/registrations/corporate`        | platform_admin |
| `/admin/registrations/cleantech`        | platform_admin |
| `/admin/registrations/climate-finance`  | platform_admin |

### Vendor Panel
| Path                 | Role   |
|----------------------|--------|
| `/vendor`            | vendor |
| `/vendor/profile`    | vendor |
| `/vendor/onboarding` | vendor |

### Reporting Module
| Path                         | Role                           |
|------------------------------|--------------------------------|
| `/consultant`                | consultant                     |
| `/consultant/reports/new`    | consultant                     |
| `/consultant/reports/[id]`   | consultant, manager            |
| `/manager`                   | manager, platform_admin        |

## State Management

Zustand store (`src/store/authStore.ts`) persisted to `localStorage` under the key `ploxi-auth`.

```ts
{
  user: User | null,
  accessToken: string | null,
  isAuthenticated: boolean,
  setAuth: (user, accessToken) => void,
  clearAuth: () => void
}
```

## Services

| File                          | Description                                 |
|-------------------------------|---------------------------------------------|
| `src/services/auth.service.ts`      | Auth (login, register, forgot/reset)  |
| `src/services/admin.service.ts`     | Admin CRUD + vendor lifecycle         |
| `src/services/vendor.service.ts`    | Vendor profile + registration helpers |
| `src/services/consultant.service.ts`| GHG calculator + sustainability reports |

## Utility Classes (Tailwind)

| Class             | Usage                     |
|-------------------|---------------------------|
| `.btn-primary`    | Filled green button       |
| `.btn-secondary`  | Filled dark button        |
| `.btn-outline`    | Outlined button           |
| `.input-field`    | Standard form input       |
| `.label`          | Form label                |
| `.card`           | White rounded shadow box  |
| `.badge-pending`  | Yellow status badge       |
| `.badge-approved` | Green status badge        |
| `.badge-rejected` | Red status badge          |
| `.badge-onboarded`| Blue status badge         |
