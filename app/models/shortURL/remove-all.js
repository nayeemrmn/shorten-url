import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Remove all short URL entries. */
export default async () => {
  return databaseConnect().then(database => {
    return database.deleteAll(COLLECTIONS.SHORT_URLS).catch(error => {
      return Promise.reject(`Couldn't remove all short URL data: ${error}`);
    });
  });
};
