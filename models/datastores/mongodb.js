'use strict';

/**
 * Mongo adapter
 */
const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

const mongoUrl = config.mongoUrl;
const mongoDbName = config.mongoDbName;

/**
 * Creates a Mongo connection
 *
 * @param {function} callback Signature: (err, db)
 */
function getClient(callback) {
  const mongoOpts = { useNewUrlParser: true, useUnifiedTopology: true };
  MongoClient.connect(mongoUrl, mongoOpts, (err, client) => {
    if (err || !client) {
      console.log(`Couldn't connect to Mongo at ${mongoUrl}`);
      if (err) {
        console.error(err);
      }
      return callback(err);
    }

    // const db = client;
    // db.close = client.close;

    // console.log('Connected to Mongo server');
    // return callback(null, db);
    return callback(null, client);
  });
}

/**
 * Base model to instantiate a collection-specific model
 *
 * @param {string} collectionName A name of collection to use
 */
function Collection(collectionName) {
  if (!mongoUrl) {
    return undefined;
  }

  if (typeof collectionName !== 'string' || !collectionName.length) {
    throw new Error('Collection name provided to base model needs to be a string.');
  }

  const rtnModelObject = {
    _type: 'mongodb',
    insertOne: function insertMany(data, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        if (error) {
          console.log(error);
          return callback(error);
        }
        const col = db.collection(collectionName);

        return col.insertOne(data, (err, r) => {
          // console.log(r.upsertedId._id);
          client.close();
          return callback(err, r);
        });
      });
    },

    insertMany: function insertMany(data, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        if (error) {
          console.log(error);
          return callback(error);
        }
        const col = db.collection(collectionName);

        return col.insertMany(data, { multi: true }, (err, r) => {
          // console.log(r.upsertedId._id);
          client.close();
          return callback(err, r);
        });
      });
    },

    updateOne: function updateOne(whereQuery, data, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        if (error) {
          console.log(error);
          return callback(error);
        }
        const col = db.collection(collectionName);

        return col.updateOne(whereQuery, { $set: data }, { upsert: true }, (err, r) => {
          console.log(err);
          // console.log(r.upsertedId._id);
          client.close();
          return callback(err, r);
        });
      });
    },

    getById: function getById(id, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        return col.find({ id }).limit(1).toArray((err, reply) => {
          client.close();
          return callback(err, (reply && reply.length ? reply[0] : null));
        });
      });
    },


    find: function find(query, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        return col.find(query).toArray((err, reply) => {
          client.close();
          return callback(err, reply);
        });
      });
    },

    count: function count(query, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        return col.countDocuments(query, (err, reply) => {
        // col.estimatedDocumentCount(query, (err, reply) => {
          client.close();
          return callback(err, reply);
        });
      });
    },

    deleteOne: function deleteOne(query, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        return col.deleteOne(query, (err, reply) => {
          client.close();
          return callback(null, reply);
        });
      });
    }
  };

  return rtnModelObject;
}


const SitesCollection = new Collection('sites');
const SamplesCollection = new Collection('samples');

module.exports = {
  sites: SitesCollection,
  samples: SamplesCollection
};
