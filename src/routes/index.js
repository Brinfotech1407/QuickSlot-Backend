const express = require('express');
const { venuesRouter } = require('./venues');

const router = express.Router();

router.use('/venues', venuesRouter);

module.exports = { router };
