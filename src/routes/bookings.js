const express = require('express');
const { pool } = require('../db/pool');
const { requireCurrentUser } = require('../middleware/currentUser');
const { HttpError } = require('../utils/httpError');
const { isValidDateOnly, parsePositiveInt } = require('../utils/validators');

const bookingsRouter = express.Router();

bookingsRouter.post('/', requireCurrentUser, async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const slotId = parsePositiveInt(req.body.slotId);
    const { date } = req.body;

    if (!slotId) {
      throw new HttpError(400, 'slotId must be a positive integer');
    }

    if (!isValidDateOnly(date)) {
      throw new HttpError(400, 'date must be in YYYY-MM-DD format');
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, venue_id, slot_id, booking_date)
       SELECT $1, s.venue_id, s.id, $3::date
       FROM slots s
       JOIN users u ON u.id = $1
       WHERE s.id = $2
       RETURNING
         id,
         user_id AS "userId",
         venue_id AS "venueId",
         slot_id AS "slotId",
         TO_CHAR(booking_date, 'YYYY-MM-DD') AS date,
         status,
         created_at AS "createdAt"`,
      [userId, slotId, date]
    );

    if (result.rowCount === 0) {
      const [userResult, slotResult] = await Promise.all([
        pool.query('SELECT id FROM users WHERE id = $1', [userId]),
        pool.query('SELECT id FROM slots WHERE id = $1', [slotId]),
      ]);

      if (userResult.rowCount === 0) {
        throw new HttpError(401, 'Invalid user');
      }

      if (slotResult.rowCount === 0) {
        throw new HttpError(404, 'Slot not found');
      }

      throw new HttpError(400, 'Booking could not be created');
    }

    res.status(201).json({
      message: 'Slot booked successfully',
      booking: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      next(new HttpError(409, 'Slot already booked for this date'));
      return;
    }

    next(error);
  }
});

bookingsRouter.delete('/:id', requireCurrentUser, async (req, res, next) => {
  try {
    const bookingId = parsePositiveInt(req.params.id);

    if (!bookingId) {
      throw new HttpError(400, 'Invalid booking id');
    }

    const result = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled', cancelled_at = NOW()
       WHERE id = $1
         AND user_id = $2
         AND status = 'booked'
       RETURNING
         id,
         user_id AS "userId",
         venue_id AS "venueId",
         slot_id AS "slotId",
         TO_CHAR(booking_date, 'YYYY-MM-DD') AS date,
         status,
         cancelled_at AS "cancelledAt"`,
      [bookingId, req.currentUserId]
    );

    if (result.rowCount === 0) {
      throw new HttpError(404, 'Active booking not found for this user');
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { bookingsRouter };
