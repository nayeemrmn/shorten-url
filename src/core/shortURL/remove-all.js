import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Remove all short URL entries. */
export default async () => {
  const database = await databaseConnect();
  const globals = await database.pullGlobals()
    .catch(e => Promise.reject(`Couldn't reset the next index: ${e}`));
  globals.nextIndex = 0;
  await database.pushGlobals(globals)
    .catch(e => Promise.reject(`Couldn't reset the next index: ${e}`));
  return database.deleteAll(COLLECTIONS.SHORT_URLS)
    .catch(e => Promise.reject(`Couldn't remove all short URL data: ${e}`));
};
