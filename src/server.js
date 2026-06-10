const { app } = require('./app');
const { env } = require('./config/env');

app.listen(env.port, () => {
  console.log(`QuickSlot API listening on port ${env.port}`);
});
