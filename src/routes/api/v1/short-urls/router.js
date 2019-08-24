import express from 'express';

import authenticateAdmin from '../../../../utils/authenticateAdmin.js';
import createShortURL from '../../../../core/shortURL/create.js';
import findShortURL from '../../../../core/shortURL/find.js';
import parseRequestBody from '../../../../utils/parse-request-body.js';
import removeAllShortURLs from '../../../../core/shortURL/remove-all.js';
import respond from '../../../../utils/respond.js';
import shortURL from './short-url/router.js';

const router = express.Router();

router.get('/', async (request, response, next) => {
  await findShortURL(
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
    .then(shortURLEntries => {
      respond(response, {
        json: {
          shortURLEntries: shortURLEntries.map(([id, data]) => ({id, data}))
        }
      });
    })
    .catch(error => {
      respond(response, {status: 500, error});
    });
});

router.post('/', async (request, response, next) => {
  await parseRequestBody(request)
    .then(({url}) => {
      createShortURL(url)
        .then(([id, shortURL]) => {
          respond(response, {
            json: {
              id,
              data: shortURL,
              url: `${request.protocol}://${request.get('Host')}/${
                shortURL.path
              }`
            }
          });
        })
        .catch(error => {
          respond(response, {status: 500, error});
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
  await removeAllShortURLs()
    .then(() => {
      respond(response);
    })
    .catch(error => {
      respond(response, {status: 500, error});
    });
});

router.use('/:urlID', shortURL);

export default router;
