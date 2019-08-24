import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Remove all short URL entries. */
export default async () => {
  const database = await databaseConnect();
  const globals = await database.pullGlobals();
  globals.nextIndex = 0;
  await database.pushGlobals(globals);
  return await database.deleteAll(COLLECTIONS.SHORT_URLS);
};
