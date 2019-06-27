import express from 'express';

import shortURLs from './short-urls/router.js';

export default express.Router().use('/short-urls', shortURLs);
