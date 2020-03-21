'use strict';

/**
 * Memcache adapter
 */
const _ = require('lodash');

const cache = {};

/**
 * Base model to instantiate a collection-specific model
 *
 * @param {string} collectionName A name of collection to use
 */
function Model(storeName) {
  if (typeof storeName !== 'string' || !storeName.length) {
    throw new Error('Store name provided to base model needs to be a string.');
  }

  cache[storeName] = cache[storeName] || {};

  const store = cache[storeName];

  const rtnModelObject = {
    _type: 'memcache',
    upsert: function upsert(data, callback) {
      if (!data || !data.id) {
        throw new Error('ID. must be provided');
      }

      const newData = data;

      newData.timestamp = Date.now();
      store[newData.id] = newData;

      return callback(null, newData);
    },

    getById: function getById(id, callback) {
      const data = store[id];
      return callback(null, data);
    },


    find: function find(query, callback) {
      const dataFlattened = _.map(store, (x) => {
        return x;
      });
      const filtered = _.filter(dataFlattened, query);

      return callback(null, filtered);
    },

    // deleteOne: function deleteOne(id, callback) {
    //   delete store[id];
    //   // col.deleteOne(query, function(err, reply) {
    //   //   return callback(null, reply);
    //   // });
    // }
  };

  return rtnModelObject;
}


const sitesModel = new Model('sites');
const requestsModel = new Model('requests');

module.exports = {
  sites: sitesModel,
  requests: requestsModel
};
