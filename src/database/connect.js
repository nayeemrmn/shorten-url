import bson from 'bson';
import mongodb from 'mongodb';
import process from 'process';

import COLLECTIONS from './collections.js';
import CoreError from '../core-error.js';

export default async () => {
  if (process.env.MONGODB_URI == null) {
    throw new CoreError(
      CoreError.Kind.DatabaseNotSet,
      'MONGODB_URI is not set.'
    );
  }
  const client = await mongodb.MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  }).catch(e => {
    throw new CoreError(CoreError.Kind.DatabaseConnectionFailure, `${e}`);
  });
  const database = client.db();
  return {
    push: mongoPush.bind(null, database),
    pull: mongoPull.bind(null, database),
    delete: mongoDelete.bind(null, database),
    find: mongoFind.bind(null, database),
    deleteAll: mongoDeleteAll.bind(null, database),
    pushGlobals: mongoPushGlobals.bind(null, database),
    pullGlobals: mongoPullGlobals.bind(null, database)
  };
};

const mongoPush = async (database, collectionName, document, id = null) => {
  const collection = database.collection(collectionName);
  if (id == null) {
    const {insertedId} = await collection.insertOne(document).catch(e => {
      throw new CoreError(
        CoreError.Kind.DatabaseOperationFailure,
        'Failed to insert the document into ' +
          `collection '${collectionName}': ${e}`
      );
    });
    return `${insertedId}`;
  }
  try {
    const objectId = new bson.ObjectID(id);
    await collection.replaceOne({_id: objectId}, {...document, _id: objectId});
    return id;
  } catch (e) {
    throw new CoreError(
      CoreError.Kind.DatabaseOperationFailure,
      'Failed to replace the document in collection ' +
        `'${collectionName}' with ID '${id}': ${e}`
    );
  }
};

const mongoPull = async (database, collectionName, id) => {
  let objectId;
  try {
    objectId = new bson.ObjectID(id);
  } catch (e) {
    throw new CoreError(CoreError.Kind.NotFound, `Invalid ID '${id}': ${e}`);
  }
  const document = await database
    .collection(collectionName)
    .findOne({_id: objectId})
    .catch(e => {
      throw new CoreError(
        CoreError.Kind.DatabaseOperationFailure,
        `Failed to open the collection '${collectionName}' ` +
          `to pull the document with ID '${id}': ${e}`
      );
    });
  if (document == null) {
    throw new CoreError(
      CoreError.Kind.NotFound,
      `Couldn't find a document in collection ` +
        `'${collectionName}' with ID '${id}'.`
    );
  }
  const result = {...document};
  delete result._id;
  return result;
};

const mongoDelete = async (database, collectionName, id) => {
  const {deletedCount} = await database
    .collection(collectionName)
    .deleteOne({_id: new bson.ObjectID(id)})
    .catch(e => {
      throw new CoreError(
        CoreError.Kind.DatabaseOperationFailure,
        `Failed to open the collection ` +
          `'${collectionName}' to delete the document with ID '${id}': ${e}`
      );
    });
  if (deletedCount == 0) {
    throw new CoreError(
      CoreError.Kind.NotFound,
      `Couldn't find a document in collection ` +
        `'${collectionName}' with ID '${id}'.`
    );
  }
};

const mongoFind = async (
  database,
  collectionName,
  {...query},
  {sort = null, limit = null} = {}
) => {
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
  const results = await cursor.toArray().catch(e => {
    throw new CoreError(
      CoreError.Kind.DatabaseOperationFailure,
      `Failed to open the collection ` +
        `'${collectionName}' to find documents: ${e}`
    );
  });
  return results.map(({...result}) => {
    const id = result._id;
    delete result._id;
    return [id, result];
  });
};

const mongoDeleteAll = async (database, collectionName) => {
  await database
    .collection(collectionName)
    .deleteMany({})
    .catch(e => {
      throw new CoreError(
        CoreError.Kind.DatabaseOperationFailure,
        `Failed to delete all documents in the ` +
          `collection '${collectionName}': ${e}`
      );
    });
};

const mongoPushGlobals = async (database, document) => {
  try {
    database
      .collection(COLLECTIONS.GLOBAL)
      .replaceOne({}, {...document}, {upsert: true});
  } catch (e) {
    throw new CoreError(
      CoreError.Kind.DatabaseOperationFailure,
      `Failed to replace the global document': ${e}`
    );
  }
};

const mongoPullGlobals = async database => {
  const document = await database
    .collection(COLLECTIONS.GLOBAL)
    .findOne()
    .catch(e => {
      throw new CoreError(
        CoreError.Kind.DatabaseOperationFailure,
        `Failed to open the global document: ${e}`
      );
    });
  if (document == null) {
    return {};
  }
  const result = {...document};
  delete result._id;
  return result;
};
