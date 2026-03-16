# Ploxi Backend API

Node.js + Express REST API for the Ploxi platform.

## Setup

```bash
cp .env.example .env    # fill in values
npm install
npm run dev             # http://localhost:5000
```

## Environment Variables

| Variable             | Description                         |
|----------------------|-------------------------------------|
| `PORT`               | Server port (default 5000)          |
| `MONGO_URI`          | MongoDB connection string           |
| `JWT_SECRET`         | Access token secret                 |
| `JWT_REFRESH_SECRET` | Refresh token secret                |
| `JWT_EXPIRES_IN`     | Access token TTL (e.g. `1d`)        |
| `SMTP_HOST`          | Email SMTP host                     |
| `SMTP_PORT`          | SMTP port                           |
| `SMTP_USER`          | SMTP username                       |
| `SMTP_PASS`          | SMTP password                       |
| `SMTP_FROM`          | From email address                  |
| `CLIENT_URL`         | Frontend origin for CORS            |

## API Endpoints

### Auth — `/api/auth`
| Method | Path                         | Auth     | Description              |
|--------|------------------------------|----------|--------------------------|
| POST   | `/register`                  | Public   | Vendor self-register     |
| POST   | `/login`                     | Public   | Login (all roles)        |
| GET    | `/me`                        | Bearer   | Get current user         |
| POST   | `/forgot-password`           | Public   | Send reset email         |
| PATCH  | `/reset-password/:token`     | Public   | Reset password           |
| PATCH  | `/change-password`           | Bearer   | Change password          |

### Admin — `/api/admin` _(platform_admin only)_
| Method | Path                                    | Description                    |
|--------|-----------------------------------------|--------------------------------|
| GET    | `/dashboard`                            | Stats overview                 |
| POST   | `/create-admin`                         | Create admin/manager user      |
| GET    | `/vendors`                              | List vendors (search/filter)   |
| GET    | `/vendors/:id`                          | Get vendor detail              |
| POST   | `/vendors`                              | Add vendor (sends invite)      |
| PATCH  | `/vendors/:id/approve`                  | Approve vendor                 |
| PATCH  | `/vendors/:id/reject`                   | Reject vendor                  |
| PATCH  | `/vendors/:id/schedule-meeting`         | Schedule intro meeting         |
| PATCH  | `/vendors/:id/send-agreement`           | Send agreement PDF             |
| PATCH  | `/vendors/:id/mark-signed`              | Mark agreement signed          |
| PATCH  | `/vendors/:id/complete-onboarding`      | Mark vendor onboarded          |
| GET    | `/registrations/corporate`              | List corporate registrations   |
| GET    | `/registrations/cleantech`              | List cleantech registrations   |
| GET    | `/registrations/climate-finance`        | List climate finance regs      |

### Vendor — `/api/vendor` _(vendor only)_
| Method | Path           | Description          |
|--------|----------------|----------------------|
| GET    | `/profile`     | Get my profile       |
| PUT    | `/profile`     | Update my profile    |
| GET    | `/onboarding`  | Get onboarding status|

### Public Registrations
| Method | Path                          | Description                  |
|--------|-------------------------------|------------------------------|
| POST   | `/api/corporate/register`     | Corporate enquiry            |
| POST   | `/api/cleantech/register`     | CleanTech registration       |
| POST   | `/api/climate-finance/register` | Climate Finance registration|

### GHG Calculator — `/api/ghg`
| Method | Path         | Auth     | Description            |
|--------|--------------|----------|------------------------|
| POST   | `/calculate` | Optional | Calculate emissions    |
| GET    | `/history`   | Bearer   | Get calculation history|

### Consultant Reports — `/api/consultant/reports`
| Method | Path              | Roles                        | Description           |
|--------|-------------------|------------------------------|-----------------------|
| POST   | `/`               | consultant                   | Create report (draft) |
| GET    | `/my`             | consultant                   | My reports            |
| GET    | `/`               | manager, platform_admin      | All reports           |
| GET    | `/:id`            | consultant, manager          | Get report            |
| PUT    | `/:id`            | consultant                   | Update report         |
| PATCH  | `/:id/submit`     | consultant                   | Submit for review     |
| PATCH  | `/:id/approve`    | manager, platform_admin      | Approve report        |
| PATCH  | `/:id/publish`    | manager, platform_admin      | Publish report        |

## Onboarding Lifecycle Stages

```
invited → profile_submitted → company_details_submitted → meeting_scheduled
         → agreement_sent → agreement_signed → onboarded
```
