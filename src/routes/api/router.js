import express from 'express';

import respond from '../../utils/respond.js';
import v1 from './v1/router.js';

export default express
  .Router()
  .use('/v1', v1)
  .use((request, response, next) => {
    respond(response, {status: 404});
  });
