import bson from 'bson';
import mongodb from 'mongodb';
import process from 'process';

import COLLECTIONS from './collections.js';

export default async () => new Promise((resolve, reject) => {
  mongodb.MongoClient.connect(process.env.MONGODB_URI,
    {useNewUrlParser: true}, (error, client) => {
      if (error) {
        reject(`Couldn't connect to the database: ${error}`);
      } else {
        const database = client.db(process.env.MONGODB_URI.slice(
          process.env.MONGODB_URI.lastIndexOf('/') + 1))
        resolve({
          push: mongoPush.bind(null, database),
          pull: mongoPull.bind(null, database),
          find: mongoFind.bind(null, database),
          pushGlobals: mongoPushGlobals.bind(null, database),
          pullGlobals: mongoPullGlobals.bind(null, database)
        });
      }
    });
});

const mongoPush = async (database, collectionName, document, id = null) => {
  const collection = database.collection(collectionName);
  if (id == null) {
    return new Promise((resolve, reject) =>
      collection.insertOne(document, (error) => {
        if (error) {
          reject(`Failed to insert the document into collection `
            + `'${collectionName}': ${error}`);
        } else {
          resolve(`${document._id}`);
        }
      })
    );
  } else {
    try {
      const objectID = new bson.ObjectID(id);
      collection.replaceOne({_id: objectID}, {...document, _id: objectID});
      return id;
    } catch (error) {
      return Promise.reject(`Failed to replace the document in collection `
        + `'${collectionName}' with ID '${id}': ${error}`);
    }
  }
}

const mongoPull = async (database, collectionName, id) => {
  return database.collection(collectionName)
    .findOne({_id: new bson.ObjectID(id)}).catch(error => {
      return Promise.reject(`Failed to open the collection '${collectionName}' `
        + `to pull document with ID '${id}': ${error}`);
    }).then(document => {
      if (document == null) {
        return Promise.reject(
          `Couldn't find the document in collection '${collectionName}' with `
            + `ID '${id}'.`);
      } else {
        const result = {...document};
        delete result._id;
        return result;
      }
    });
};

const mongoFind = async (database, collectionName, {...query}, {
  sort = null,
  limit = null
} = {}) => {
  delete query._id;
  let cursor = database.collection(collectionName).find(query);
  if (sort != null) {
    cursor = cursor.sort(sort);
  } else {
    cursor = cursor.sort({_id: 1});
  }
  if (limit != null) {
    if (limit == 0) {
      return [];
    }
    cursor = cursor.limit(limit);
  }
  return cursor.toArray()
    .catch(error => {
      return Promise.reject(`Failed to open the collection '${collectionName}' `
        + `to find documents: ${error}`);
    }).then(results => results.map(({...result}) => {
      const id = result._id;
      delete result._id;
      return [id, result];
    }));
};

const mongoPushGlobals = async (database, document) => {
  try {
    database.collection(COLLECTIONS.GLOBAL).replaceOne({}, {...document},
      {upsert: true});
  } catch (error) {
    return Promise.reject(`Failed to replace the global document': ${error}`);
  }
};

const mongoPullGlobals = async database => {
  return database.collection(COLLECTIONS.GLOBAL).findOne()
    .catch(error => {
      return Promise.reject(`Failed to open the global document: ${error}`);
    }).then(document => {
      if (document == null) {
        return {};
      } else {
        const result = {...document};
        delete result._id;
        return result;
      }
    });
};
