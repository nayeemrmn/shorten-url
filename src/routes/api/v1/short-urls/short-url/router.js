import express from 'express';

import authenticateAdmin from '../../../../../utils/authenticate-admin.js';
import getShortUrl from '../../../../../core/short-url/get.js';
import inferErrorStatus from '../../../../../utils/infer-error-status.js';
import removeShortUrl from '../../../../../core/short-url/remove.js';
import respond from '../../../../../utils/respond.js';

const router = express.Router({mergeParams: true});

router.get('/', async (request, response, next) => {
  await getShortUrl(request.params.urlId)
    .then(shortUrl => {
      respond(response, {json: shortUrl});
    })
    .catch(error => {
      respond(response, {status: inferErrorStatus(error.kind), error});
    });
});

router.delete('/', async (request, response, next) => {
  if (!authenticateAdmin(request)) {
    return respond(response, {denyAuthorization: true});
  }
  await removeShortUrl(request.params.urlId)
    .then(() => {
      respond(response);
    })
    .catch(error => {
      respond(response, {status: inferErrorStatus(error.kind), error});
    });
});

export default router;
