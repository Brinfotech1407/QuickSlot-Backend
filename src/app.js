const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { env } = require('./config/env');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { router } = require('./routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
