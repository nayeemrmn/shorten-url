import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

const UNUSABLE_PATHS = Object.freeze(['api']);

/* Create a short URL entry and resolve with an (ID, shortUrl) tuple. */
export default async destination => {
  const database = await databaseConnect();
  const globals = await database.pullGlobals();
  let index = globals.nextIndex || 0;
  for (; UNUSABLE_PATHS.includes(index.toString(36)); index++);
  globals.nextIndex = index + 1;
  await database.pushGlobals(globals);
  const shortUrl = {destination, path: index.toString(36)};
  const id = await database.push(COLLECTIONS.SHORT_URLS, shortUrl);
  return [id, shortUrl];
};
