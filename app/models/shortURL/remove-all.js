import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

/* Remove all short URL entries. */
export default async () => {
  return databaseConnect().then(database => {
    return database.pullGlobals().then(globals => {
      globals.nextIndex = 0;
      return database.pushGlobals(globals);
    }).catch(error => {
      return Promise.reject(`Couldn't reset the index: ${error}`);
    }).then(() => {
      return database.deleteAll(COLLECTIONS.SHORT_URLS).catch(error => {
        return Promise.reject(`Couldn't remove all short URL data: ${error}`);
      });
    });
  });
};
