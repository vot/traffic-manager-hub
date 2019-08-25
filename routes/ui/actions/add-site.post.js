const _ = require('lodash');

const SitesModel = require('../../../models/mongo').sites;
const SiteLib = require('../../../lib/site');

module.exports = (req, res) => {
  const siteName = _.get(req, 'body.siteName');
  const siteVisibility = _.get(req, 'body.siteVisibility');

  if (!siteName || !siteVisibility) {
    return res.render('add-site/add-site-error', { error: 'Site name and site visibility must be specified.' });
  }

  const newSiteKey = SiteLib.generateSiteKeyFromName(siteName);

  return SitesModel.find({ siteKey: newSiteKey }, (findErr, findData) => {
    if (findData && findData.length) {
      return res.render('add-site/add-site-error', { error: `siteKey "${newSiteKey}" already exists` });
    }

    // if no site with that key found then proceed with creating one
    const newSiteData = SiteLib.createSiteObject({ siteName, siteVisibility });
    console.log('inserting newSiteData', newSiteData);

    return SitesModel.insertOne(newSiteData, (insertErr, insertData) => {
      if (insertErr || !insertData) {
        return res.render('add-site/add-site-error', { error: insertErr || 'insertData empty' });
      }

      console.log(`siteKey "${newSiteData.siteKey}" inserted correctly`);

      return res.render('add-site/add-site-success', { site: newSiteData });
    });
  });
};
