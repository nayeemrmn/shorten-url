import express from 'express';

import createShortURL from '../../../../models/shortURL/create.js';
import parseRequestBody from '../../../../utils/parse-request-body.js';
import respond from '../../../../utils/respond.js';
import shortURL from './short-url/router.js';

const router = express.Router();

router.post('/', (request, response, next) => {
  parseRequestBody(request).then(({url}) => {
    createShortURL(url).then(([id, shortURL]) => {
      respond(response, {json: {
        id,
        data: shortURL,
        url: `${request.protocol}://${request.get('Host')}/${shortURL.path}`
      }});
    }).catch(error => {
      respond(response, {status: 500, error});
    });
  }).catch(error => {
    respond(response, {status: 400, error});
  });
});

router.use('/:urlID', shortURL);

export default router;
