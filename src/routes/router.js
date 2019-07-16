import express from 'express';

import api from './api/router.js';
import findShortURLs from '../core/shortURL/find.js';
import respond from '../utils/respond.js';

const router = express.Router();

router.use('/api', api);

router.use('/:path', (request, response, next) => {
  findShortURLs({path: request.params.path}).then(results => {
    if (results.length == 0) {
      return respond(response,
        {status: 404, error: 'Path is not registered to a destination URL.'});
    }
    const [, shortURL] = results[0];
    respond(response, {status: 301, redirect: shortURL.destination});
  }).catch(error => {
    respond(response, {status: 500, error});
  });
});

export default router;
