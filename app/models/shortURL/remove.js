import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Remove a short URL entry by its ID. */
export default async id => {
  return databaseConnect().then(database => {
    return database.delete(COLLECTIONS.SHORT_URLS, id).catch(error => {
      return Promise.reject(`Couldn't remove the short URL data: ${error}`);
    });
  });
};
