import express from 'express';

import authenticateAdmin from '../../../../utils/authenticate-admin.js';
import createShortUrl from '../../../../core/short-url/create.js';
import findShortUrl from '../../../../core/short-url/find.js';
import inferErrorStatus from '../../../../utils/infer-error-status.js';
import parseRequestBody from '../../../../utils/parse-request-body.js';
import removeAllShortUrls from '../../../../core/short-url/remove-all.js';
import respond from '../../../../utils/respond.js';
import shortUrl from './short-url/router.js';

const router = express.Router();

router.get('/', async (request, response, next) => {
  await findShortUrl(
    {},
    {
      sort:
        request.query.sort != null
          ? Object.fromEntries(
              Object.entries(request.query.sort).map(([key, value]) => [
                key,
                Number(value)
              ])
            )
          : null,
      limit: request.query.limit != null ? Number(request.query.limit) : null
    }
  )
    .then(shortUrlEntries => {
      respond(response, {
        json: {
          shortUrlEntries: shortUrlEntries.map(([id, data]) => ({id, data}))
        }
      });
    })
    .catch(error => {
      respond(response, {status: 500, error});
    });
});

router.post('/', async (request, response, next) => {
  await parseRequestBody(request)
    .then(async ({url}) => {
      await createShortUrl(url)
        .then(([id, shortUrl]) => {
          respond(response, {
            json: {
              id,
              data: shortUrl,
              url: `${request.protocol}://${request.get('Host')}/${
                shortUrl.path
              }`
            }
          });
        })
        .catch(error => {
          respond(response, {status: inferErrorStatus(error.kind), error});
        });
    })
    .catch(error => {
      respond(response, {status: 400, error});
    });
});

router.delete('/', async (request, response, next) => {
  if (!authenticateAdmin(request)) {
    return respond(response, {denyAuthorization: true});
  }
  await removeAllShortUrls()
    .then(() => {
      respond(response);
    })
    .catch(error => {
      respond(response, {status: inferErrorStatus(error.kind), error});
    });
});

router.use('/:urlId', shortUrl);

export default router;
