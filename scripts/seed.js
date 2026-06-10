const fs = require('fs/promises');
const path = require('path');
const { pool } = require('../src/db/pool');

async function main() {
  const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');
  const seed = await fs.readFile(seedPath, 'utf8');

  await pool.query(seed);
  console.log('Database seeded');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
