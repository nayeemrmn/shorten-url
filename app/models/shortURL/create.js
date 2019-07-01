import COLLECTIONS from '../../database/collections.js';
import databaseConnect from '../../database/connect.js';

const UNUSABLE_PATHS = Object.freeze([
  'api'
]);

/* Create a short URL entry and resolve with an (ID, shortURL) tuple. */
export default async destination => {
  return databaseConnect().then(database => {
    return database.pullGlobals().catch(error => {
      return Promise.reject(`Couldn't get the next index: ${error}`);
    }).then(globals => {
      if (!globals.nextIndex) {
        globals.nextIndex = 0;
      }
      let path;
      do {
        path = globals.nextIndex.toString(36);
        globals.nextIndex++;
      } while (UNUSABLE_PATHS.includes(path));
      const shortURL = {destination, path};
      return database.pushGlobals(globals).catch(error => {
        return Promise.reject(`Failed to commit the next index: ${error}`);
      }).then(() => {
        return database.push(COLLECTIONS.SHORT_URLS, shortURL).catch(error => {
          return Promise.reject(`Failed to commit the short URL data: `
            + error);
        }).then(id => {
          return [id, shortURL];
        });
      });
    });
  });
};
