const express = require('express');
const { pool } = require('../db/pool');
const { HttpError } = require('../utils/httpError');
const { parsePositiveInt } = require('../utils/validators');

const usersRouter = express.Router();

usersRouter.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, name FROM users ORDER BY id');

    res.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/:id/bookings', async (req, res, next) => {
  try {
    const userId = parsePositiveInt(req.params.id);

    if (!userId) {
      throw new HttpError(400, 'Invalid user id');
    }

    const userResult = await pool.query('SELECT id, name FROM users WHERE id = $1', [userId]);

    if (userResult.rowCount === 0) {
      throw new HttpError(404, 'User not found');
    }

    const bookingsResult = await pool.query(
      `SELECT
         b.id,
         b.user_id AS "userId",
         b.venue_id AS "venueId",
         v.name AS "venueName",
         v.sport,
         v.area,
         b.slot_id AS "slotId",
         TO_CHAR(b.booking_date, 'YYYY-MM-DD') AS date,
         s.start_time AS "startTime",
         s.end_time AS "endTime",
         b.status,
         b.created_at AS "createdAt",
         b.cancelled_at AS "cancelledAt"
       FROM bookings b
       JOIN venues v ON v.id = b.venue_id
       JOIN slots s ON s.id = b.slot_id
       WHERE b.user_id = $1
       ORDER BY b.booking_date DESC, s.start_time DESC, b.id DESC`,
      [userId]
    );

    res.json({
      user: userResult.rows[0],
      bookings: bookingsResult.rows,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { usersRouter };
