const express = require('express');
const { bookingsRouter } = require('./bookings');
const { usersRouter } = require('./users');
const { venuesRouter } = require('./venues');

const router = express.Router();

router.use('/bookings', bookingsRouter);
router.use('/users', usersRouter);
router.use('/venues', venuesRouter);

module.exports = { router };
