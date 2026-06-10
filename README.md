# QuickSlot Backend

REST API for booking sports slots. Built with Node.js, Express, and PostgreSQL.

## Setup

```bash
npm install
copy .env.example .env
npm run db:reset
npm run dev
```

## Endpoints

- `GET /health`
- `GET /venues`
- `GET /venues/:id/slots?date=YYYY-MM-DD`
- `POST /bookings`
- `GET /users/:id/bookings`
- `DELETE /bookings/:id`

Use `X-User-Id` for lightweight auth on booking and cancellation endpoints.
