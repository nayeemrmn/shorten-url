import express from 'express';

import authenticateAdmin from '../../../../../utils/authenticateAdmin.js';
import getShortURL from '../../../../../core/shortURL/get.js';
import removeShortURL from '../../../../../core/shortURL/remove.js';
import respond from '../../../../../utils/respond.js';

const router = express.Router({mergeParams: true});

router.get('/', async (request, response, next) => {
  await getShortURL(request.params.urlID)
    .then(shortURL => {
      respond(response, {json: shortURL});
    })
    .catch(error => {
      respond(response, {status: 404, error});
    });
});

router.delete('/', async (request, response, next) => {
  if (!authenticateAdmin(request)) {
    return respond(response, {denyAuthorization: true});
  }
  await removeShortURL(request.params.urlID)
    .then(() => {
      respond(response);
    })
    .catch(error => {
      respond(response, {status: 404, error});
    });
});

export default router;
