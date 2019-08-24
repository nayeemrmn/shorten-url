import express from 'express';

import shortUrls from './short-urls/router.js';

export default express.Router().use('/short-urls', shortUrls);
