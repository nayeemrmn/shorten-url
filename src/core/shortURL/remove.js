import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Remove a short URL entry by its ID. */
export default async id => {
  const database = await databaseConnect();
  return await database.delete(COLLECTIONS.SHORT_URLS, id);
};
