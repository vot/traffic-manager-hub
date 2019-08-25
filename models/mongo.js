'use strict';

/**
 * Mongo adapter
 */
const MongoClient = require('mongodb').MongoClient;
const config = require('../config');

const mongoUrl = config.mongoUrl;
const mongoDbName = config.mongoDbName;

/**
 * Creates a Mongo connection
 *
 * @param {function} callback Signature: (err, db)
 */
function getClient(callback) {
  MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err || !client) {
      console.log(`Couldn't connect to Mongo at ${mongoUrl}`);
      if (err) {
        console.error(err);
      }
      return callback(err);
    }

    // const db = client;
    // db.close = client.close;

    console.log('Connected to Mongo server');
    // return callback(null, db);
    return callback(null, client);
  });
}

/**
 * Base model to instantiate a collection-specific model
 *
 * @param {string} collectionName A name of collection to use
 */
function Model(collectionName) {
  if (!mongoUrl) {
    return undefined;
  }

  if (typeof collectionName !== 'string' || !collectionName.length) {
    throw new Error('Collection name provided to base model needs to be a string.');
  }

  const rtnModelObject = {
    _type: 'mongo',
    insertMany: function insertMany(data, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        if (error) {
          console.log(error);
          return callback(error);
        }
        const col = db.collection(collectionName);

        col.insertMany(data, { multi: true }, (err, r) => {
          // console.log(r.upsertedId._id);
          client.close();
          return callback(err, r);
        });
      });
    },

    upsert: function upsert(data, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        if (error) {
          console.log(error);
          return callback(error);
        }
        const col = db.collection(collectionName);

        col.updateOne({ id: data.id }, data, { upsert: true }, (err, r) => {
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

        col.find({ id }).limit(1).toArray((err, reply) => {
          client.close();
          return callback(err, (reply && reply.length ? reply[0] : null));
        });
      });
    },


    find: function find(query, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        col.find(query).toArray((err, reply) => {
          client.close();
          return callback(err, reply);
        });
      });
    },

    count: function count(query, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        col.count(query, (err, reply) => {
          console.log(reply);
          client.close();
          return callback(err, reply);
        });
      });
    },

    deleteOne: function deleteOne(query, callback) {
      getClient((error, client) => {
        const db = client.db(mongoDbName);
        const col = db.collection(collectionName);

        col.deleteOne(query, (err, reply) => {
          client.close();
          return callback(null, reply);
        });
      });
    }
  };

  return rtnModelObject;
}


const sitesModel = new Model('sites');
const samplesModel = new Model('samples');

module.exports = {
  sites: sitesModel,
  samples: samplesModel
};
