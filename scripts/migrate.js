const fs = require('fs/promises');
const path = require('path');
const { pool } = require('../src/db/pool');

async function main() {
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const schema = await fs.readFile(schemaPath, 'utf8');

  await pool.query(schema);
  console.log('Database schema migrated');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
