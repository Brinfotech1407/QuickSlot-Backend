const express = require('express');
const { pool } = require('../db/pool');
const { HttpError } = require('../utils/httpError');
const { isValidDateOnly, parsePositiveInt } = require('../utils/validators');

const venuesRouter = express.Router();

venuesRouter.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, sport, area, address
       FROM venues
       ORDER BY id`
    );

    res.json({ venues: result.rows });
  } catch (error) {
    next(error);
  }
});

venuesRouter.get('/:id/slots', async (req, res, next) => {
  try {
    const venueId = parsePositiveInt(req.params.id);
    const { date } = req.query;

    if (!venueId) {
      throw new HttpError(400, 'Invalid venue id');
    }

    if (!isValidDateOnly(date)) {
      throw new HttpError(400, 'date must be in YYYY-MM-DD format');
    }

    const venueResult = await pool.query(
      'SELECT id, name, sport, area, address FROM venues WHERE id = $1',
      [venueId]
    );

    if (venueResult.rowCount === 0) {
      throw new HttpError(404, 'Venue not found');
    }

    const slotsResult = await pool.query(
      `SELECT
         s.id,
         s.start_time AS "startTime",
         s.end_time AS "endTime",
         CASE WHEN b.id IS NULL THEN 'available' ELSE 'booked' END AS status
       FROM slots s
       LEFT JOIN bookings b
         ON b.slot_id = s.id
        AND b.booking_date = $2::date
        AND b.status = 'booked'
       WHERE s.venue_id = $1
       ORDER BY s.start_time`,
      [venueId, date]
    );

    res.json({
      venue: venueResult.rows[0],
      date,
      slots: slotsResult.rows,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { venuesRouter };
