# Royal Dental Care

React + Vite frontend, Express API, and SQLite database for appointment requests, contact enquiries, and reviews.

## Requirements

- Node.js 22.5 or newer (SQLite uses Node's built-in `node:sqlite`; use a current LTS release)
- npm

## First run

Open two terminals in the project folder.

### 1. Start the API

```powershell
cd dental-backend
npm install
Copy-Item .env.example .env
npm run dev
```

The first run creates `dental-backend/data/dental_clinic.db`, initializes tables and indexes, and seeds sample public reviews. Keep the `.env` file private. The sample staff token below is a placeholder; generate your own random secret before enabling staff endpoints.

### 2. Start the website

```powershell
cd dental
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Vite forwards `/api/*` requests to `http://localhost:5000`; the browser does not need a secret or direct database access.

For a production frontend build, run `npm run build` in `dental`. Serve `dental/dist` through your web server and configure that server to proxy `/api` to the backend. Set `FRONTEND_ORIGIN` to the exact public website origin(s). Use HTTPS and a persistent disk for SQLite.

## Configuration

Copy `dental-backend/.env.example` to `dental-backend/.env` and set:

- `ADMIN_API_TOKEN`: a unique random value of at least 32 characters. The staff data endpoints fail closed when it is absent or weak. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `FRONTEND_ORIGIN`: comma-separated exact browser origins. Local Vite defaults are preconfigured.
- `PORT`: API port, default `5000`.
- `WA_PHONE_NUMBER_ID` and `WA_ACCESS_TOKEN`: not used by appointment submission. Booking data is stored without being forwarded to WhatsApp.

Never put staff tokens, database credentials, or other secrets in `dental/.env*` files prefixed with `VITE_`; those values are bundled into browser code. Public Google Maps configuration, if used, belongs in the frontend environment and must be restricted to the website origin in Google Cloud.

## API behavior

- `GET /api/health` — public readiness, database engine, and uptime.
- `POST /api/appointments` — validates and saves a request as `pending`; date/time preferences are requests, not confirmations. If no date is chosen, the UI records today with a flexible time. Returns a reference such as `RDC-...`.
- `POST /api/contact` — validates and stores a contact enquiry.
- `GET /api/reviews` — public reviews.
- `POST /api/reviews` — stores a submitted review as unverified (`verified=0`).
- `GET /api/appointments`, `GET /api/appointments/stats`, `PATCH /api/appointments/:id/status`, `DELETE /api/appointments/:id`, `GET /api/admin/reviews`, and `GET /api/contacts` — staff-only; send `Authorization: Bearer <ADMIN_API_TOKEN>` from a trusted staff tool/server. Appointment listing accepts `limit` (1–100, default 50) and `offset` query parameters. Do not embed this token in the public React app.

Requests use parameterized SQLite statements, bounded JSON payloads, field validation, restricted CORS, request throttling, and generic server errors. Appointment and contact listings contain personal information and require staff authorization. The in-memory request limit is per process; deployments with multiple instances should add a shared rate limiter at the proxy/API layer.

## Data and backup

The SQLite file is `dental-backend/data/dental_clinic.db` and is excluded from Git. Back it up while the server is stopped, or use SQLite's online backup API; copy the database together with its WAL state only as a consistent backup. Restrict filesystem access to the API service account. Do not use a temporary/ephemeral filesystem for production data. Restore a backup by stopping the API and placing the database file back in `data/`.

## Troubleshooting

- `ERR_MODULE_NOT_FOUND` / `node:sqlite` unavailable: install Node 22.5+ and rerun `npm install` in `dental-backend`.
- Browser shows API/network error: confirm the API is running on port 5000, then check `GET http://localhost:5000/api/health`.
- CORS error outside local development: add the exact frontend origin (scheme, hostname, and port) to `FRONTEND_ORIGIN`, then restart the API.
- Staff route returns `503`: configure a strong `ADMIN_API_TOKEN`; `401` means the bearer token is missing or incorrect.
- Booking response says saved: the request is in SQLite as pending. Staff must follow up and confirm an actual appointment.

## Project folders

- `dental/` — React pages, shared forms, styles, and Vite config.
- `dental-backend/` — Express API, SQLite initialization, and local database directory.
