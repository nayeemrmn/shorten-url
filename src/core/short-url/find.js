import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Find short URL entries and resolve with list of (ID, shortUrl) tuples. */
export default async (query, {sort = null, limit = null} = {}) => {
  const database = await databaseConnect();
  return await database.find(COLLECTIONS.SHORT_URLS, query, {
    sort,
    limit
  });
};
