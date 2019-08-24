import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Get a short URL entry by its ID. */
export default async id => {
  const database = await databaseConnect();
  return await database.pull(COLLECTIONS.SHORT_URLS, id);
};
