import express from 'express';
import process from 'process';

import routes from './routes/router.js';

/* Read the port number from the environment variable 'PORT' or set it to 80. */
const port = process.env.PORT == undefined ? 80 : Number(process.env.PORT);
if (!Number.isFinite(port)) {
  console.error(`Invalid port: '${process.env.PORT}'`);
  process.exit(1);
}

/* Initialise the server. */
const app = express();
app.use((request, response, next) => {
  response.on('finish', () =>
    console.log(`[${`${new Date}`.split(' ', 5).join(' ')}] `
      + `[${response.statusCode}]: ${request.originalUrl}`));
  next();
});
app.use(routes);

/* Start the server. */
app.listen(port, () => {
  console.log(`Listening on 'http://127.0.0.1:${port}'.`);
  process.on('SIGINT', process.exit);
});
