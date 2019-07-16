import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Get a short URL entry by its ID. */
export default async id => {
  const database = await databaseConnect();
  return database.pull(COLLECTIONS.SHORT_URLS, id)
    .catch(e => Promise.reject(`Couldn't get the short URL data: ${e}`));
};
