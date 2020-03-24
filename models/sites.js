const datastores = require('./datastores');

const selectedDatastore = datastores.autoselect();

const MongoSitesCollection = datastores.mongo.sites;

/**
 * Gets data of all sites.
 * Returns an array of siteData objects.
 *
 * @param {function} callback Callback with (err, data) signature
 */
function getAllSites(callback) {
  if (selectedDatastore === 'mongo') {
    return MongoSitesCollection.find({}, callback);
  }

  return callback('SQLite not ready yet');
}

/**
 * Gets data of a specific site, by key.
 * It will return exactly one match or error out.
 *
 * @param {string} key
 * @param {function} callback Callback with (err, data) signature
 */
function getSiteByKey(key, callback) {
  function returnCb(err, data) {
    if (err) {
      return callback(err);
    }
    if (data.length === 0) {
      return callback('Site not found.');
    }
    if (data.length > 1) {
      return callback('Matched more than one site. Aborting.');
    }

    const siteData = data[0];
    return callback(null, siteData);
  }

  if (selectedDatastore === 'mongo') {
    return MongoSitesCollection.find({ siteKey: key }, returnCb);
  }

  return callback('SQLite not ready yet');
}

/**
 * Registers a new site record.
 * @param {object} siteData
 * @param {function} callback Callback with (err, data) signature
 */
function registerNewSite(siteData, callback) {
  if (selectedDatastore === 'mongo') {
    return MongoSitesCollection.insertOne(siteData, callback);
  }

  return callback('SQLite not ready yet');
}

/**
 * Updates an existing site record.
 * @param {object} siteData
 * @param {function} callback Callback with (err, data) signature
 */
function updateSiteSettings(siteData, callback) {
  if (selectedDatastore === 'mongo') {
    return MongoSitesCollection.updateOne({ siteId: siteData.siteId }, siteData, callback);
  }

  return callback('SQLite not ready yet');
}

/**
 * Deletes a site record.
 * @param {string} siteId
 * @param {string} siteSecret
 * @param {function} callback Callback with (err, data) signature
 */
function deleteSite(siteId, siteSecret, callback) {
  if (selectedDatastore === 'mongo') {
    return MongoSitesCollection.deleteOne({ siteId, siteSecret }, callback);
  }

  return callback('SQLite not ready yet');
}

module.exports = {
  getAllSites,
  getSiteByKey,
  registerNewSite,
  updateSiteSettings,
  deleteSite,
};
