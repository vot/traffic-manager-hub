const MongoSitesCollection = require('./datastores/mongo').sites;

function getAllSites(callback) {
  return MongoSitesCollection.find({}, callback);
}

function getSiteByKey(key, callback) {
  return MongoSitesCollection.find({ siteKey: key }, (err, data) => {
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
  });
}

function registerNewSite(siteData, callback) {
  return MongoSitesCollection.insertOne(siteData, callback);
}

function updateSiteSettings(siteData, callback) {
  return MongoSitesCollection.updateOne({ siteId: siteData.siteId }, siteData, callback);
}

function deleteSite(siteKey, siteSecret, callback) {
  return MongoSitesCollection.deleteOne({ siteKey, siteSecret }, callback);
}

module.exports = {
  getAllSites,
  getSiteByKey,
  registerNewSite,
  updateSiteSettings,
  deleteSite,
};
