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
- `POST /bookings` with `X-User-Id` and JSON body `{ "slotId": 1, "date": "2026-06-10" }`
- `GET /users/:id/bookings`
- `DELETE /bookings/:id` with `X-User-Id`

Use `X-User-Id` for lightweight auth on booking and cancellation endpoints.

## Booking Safety

The database has a partial unique index on active bookings:

```sql
CREATE UNIQUE INDEX bookings_one_active_per_slot
  ON bookings (slot_id, booking_date)
  WHERE status = 'booked';
```

If two users book the same slot at the same time, PostgreSQL accepts one insert and rejects the other. The API returns `201` for the winner and `409` with `Slot already booked for this date` for the loser.
