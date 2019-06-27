import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Get a short URL entry by its ID. */
export default async id => {
  return databaseConnect().then(database => {
    return database.pull(COLLECTIONS.SHORT_URLS, id).catch(error => {
      return Promise.reject(`Couldn't get the short URL data: ${error}`);
    });
  });
};
