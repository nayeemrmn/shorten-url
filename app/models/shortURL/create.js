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
    }).then(globals => [database, globals]);
  }).then(([database, globals]) => {
    let index = globals.nextIndex || 0;
    for (; UNUSABLE_PATHS.includes(index.toString(36)); index++);
    globals.nextIndex = index + 1;
    return database.pushGlobals(globals).catch(error => {
      return Promise.reject(`Failed to commit the next index: ${error}`);
    }).then(() => [database, index]);
  }).then(([database, index]) => {
    const shortURL = {destination, path: index.toString(36)};
    return database.push(COLLECTIONS.SHORT_URLS, shortURL).catch(error => {
      return Promise.reject(`Failed to commit the short URL data: ${error}`);
    }).then(id => [id, shortURL]);
  });
};
