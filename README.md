# QuickSlot Backend

REST API for booking sports slots. Built with Node.js, Express, and PostgreSQL.

## Setup

```powershell
npm install
Copy-Item .env.example .env
npm run db:reset
npm run dev
```

## Endpoints

- `GET /health`
- `GET /users`
- `GET /venues`
- `GET /venues/:id/slots?date=YYYY-MM-DD`
- `POST /bookings` with `X-User-Id` and JSON body `{ "slotId": 1, "date": "2026-06-10" }`
- `GET /users/:id/bookings`
- `DELETE /bookings/:id` with `X-User-Id`

Use `X-User-Id` for lightweight auth on booking and cancellation endpoints.

## Quick API Checks

Use `curl.exe` in PowerShell because `curl` is an alias for `Invoke-WebRequest`.

```powershell
curl.exe http://localhost:3000/health
curl.exe http://localhost:3000/users
curl.exe http://localhost:3000/venues
curl.exe "http://localhost:3000/venues/1/slots?date=2026-06-10"
```

Book a slot:

```powershell
curl.exe -X POST http://localhost:3000/bookings `
  -H "Content-Type: application/json" `
  -H "X-User-Id: 1" `
  -d "{\"slotId\":1,\"date\":\"2026-06-10\"}"
```

List and cancel bookings:

```powershell
curl.exe http://localhost:3000/users/1/bookings
curl.exe -X DELETE http://localhost:3000/bookings/1 -H "X-User-Id: 1"
```

Concurrency smoke test:

```powershell
npm run test:concurrency
```

## Booking Safety

The database has a partial unique index on active bookings:

```sql
CREATE UNIQUE INDEX bookings_one_active_per_slot
  ON bookings (slot_id, booking_date)
  WHERE status = 'booked';
```

If two users book the same slot at the same time, PostgreSQL accepts one insert and rejects the other. The API returns `201` for the winner and `409` with `Slot already booked for this date` for the loser.

## Railway Deploy Notes

Create a Railway project with a PostgreSQL database, then deploy this service.

Required environment variables:

```env
DATABASE_URL=<Railway PostgreSQL connection URL>
CORS_ORIGIN=*
```

Railway can use the existing package scripts:

- Build command: leave empty or use `npm install`
- Start command: `npm start`

After setting `DATABASE_URL`, run this once from the Railway shell or locally with Railway's database URL in `.env`:

```powershell
npm run db:reset
```
