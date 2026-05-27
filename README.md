    # Ploxi Earth — Platform Rebuild

A full-stack rebuild of [ploxi.earth](https://www.ploxi.earth/) with a clean, decoupled, production-ready architecture.

## Architecture

```
ploxi_earth/
├── backend/          # Node.js + Express REST API
├── frontend/         # Next.js 14 (App Router) + TypeScript
└── docker-compose.yml
```

## Quick Start

### Prerequisites
- Node.js 20+, npm 9+
- MongoDB 7+ (or Docker)

### With Docker
```bash
cp backend/.env.example backend/.env   # fill in values
docker-compose up --build
```

| Service   | URL                    |
|-----------|------------------------|
| Frontend  | http://localhost:3000  |
| Backend   | http://localhost:5000  |
| MongoDB   | mongodb://localhost:27017 |

### Without Docker

**Backend**
```bash
cd backend
cp .env.example .env      # fill in values
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

---

## User Roles & Routes

| Role             | Default Route     |
|------------------|-------------------|
| `platform_admin` | `/admin`          |
| `vendor`         | `/vendor`         |
| `consultant`     | `/consultant`     |
| `manager`        | `/manager`        |

## Public Pages

| Path                                    | Description                      |
|-----------------------------------------|----------------------------------|
| `/`                                     | Home — 3 solution cards          |
| `/corporate`                            | Corporate landing                |
| `/corporate/register`                   | 3-step registration form         |
| `/cleantech`                            | CleanTech landing                |
| `/cleantech/registration`              | 2-step registration form         |
| `/climate-finance`                      | Climate Finance landing          |
| `/climate-finance/registration`         | Dynamic form (3 types)           |
| `/tools/ghg-calculator`                 | Free GHG Scope 1/2/3 calculator  |
| `/auth/login`                           | Login                            |
| `/auth/register`                        | Vendor self-registration         |
| `/auth/forgot-password`                 | Forgot password                  |
| `/auth/reset-password/[token]`          | Reset password                   |

## Tech Stack

**Frontend:** Next.js 14 · TypeScript · Tailwind CSS · Zustand · Axios  
**Backend:** Node.js · Express · MongoDB/Mongoose · JWT · Nodemailer · Winston · Multer  
**Infra:** Docker Compose · MongoDB Atlas compatible.
