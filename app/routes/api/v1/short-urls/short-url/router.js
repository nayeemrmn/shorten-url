import express from 'express';

import getShortURL from '../../../../../models/shortURL/get.js';
import removeShortURL from '../../../../../models/shortURL/remove.js';
import respond from '../../../../../utils/respond.js';

const router = express.Router({mergeParams: true});

router.get('/', (request, response, next) => {
  getShortURL(request.params.urlID).then(shortURL => {
    respond(response, {json: shortURL});
  }).catch(error => {
    respond(response, {status: 404, error});
  });
});

router.delete('/', (request, response, next) => {
  removeShortURL(request.params.urlID).then(() => {
    respond(response);
  }).catch(error => {
    respond(response, {status: 404, error});
  });
});

export default router;
