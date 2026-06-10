require('dotenv').config();

const env = {
  port: Number(process.env.PORT || 3000),
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

module.exports = { env };
