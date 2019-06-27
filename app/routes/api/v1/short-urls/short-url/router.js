import express from 'express';

import getShortURL from '../../../../../models/shortURL/get.js';
import respond from '../../../../../utils/respond.js';

const router = express.Router({mergeParams: true});

router.get('/', (request, response, next) => {
  getShortURL(request.params.urlID).then(shortURL => {
    respond(response, {json: shortURL});
  }).catch(error => {
    respond(response, {status: 404, error});
  });
});

export default router;
