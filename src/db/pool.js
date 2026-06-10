const { Pool } = require('pg');
const { env } = require('../config/env');

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUrl.includes('localhost')
    ? false
    : { rejectUnauthorized: false },
});

module.exports = { pool };
