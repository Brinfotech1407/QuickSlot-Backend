const fs = require('fs/promises');
const path = require('path');
const { pool } = require('../src/db/pool');

async function main() {
  await pool.query(`
    DROP TABLE IF EXISTS bookings;
    DROP TABLE IF EXISTS slots;
    DROP TABLE IF EXISTS venues;
    DROP TABLE IF EXISTS users;
  `);

  const schema = await fs.readFile(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8');
  const seed = await fs.readFile(path.join(__dirname, '..', 'db', 'seed.sql'), 'utf8');

  await pool.query(schema);
  await pool.query(seed);
  console.log('Database reset, migrated, and seeded');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
