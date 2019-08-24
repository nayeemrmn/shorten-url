import express from 'express';

import api from './api/router.js';
import findShortUrls from '../core/short-url/find.js';
import inferErrorStatus from '../utils/infer-error-status.js';
import respond from '../utils/respond.js';

const router = express.Router();

router.use('/api', api);

router.use('/:path', async (request, response, next) => {
  await findShortUrls({path: request.params.path})
    .then(results => {
      if (results.length == 0) {
        return respond(response, {
          status: 404,
          error: new Error('Path is not registered to a destination URL.')
        });
      }
      const [, shortUrl] = results[0];
      respond(response, {status: 301, redirect: shortUrl.destination});
    })
    .catch(error => {
      respond(response, {status: inferErrorStatus(error.kind), error});
    });
});

export default router;
