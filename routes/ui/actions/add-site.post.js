const _ = require('lodash');

const SitesModel = require('../../../models/sites');
const SiteLib = require('../../../lib/site');

const errorTitle = 'Failed to create a new site';
const errorReturnLink = '/add-site';

module.exports = (req, res) => {
  const siteName = _.get(req, 'body.siteName');
  const siteVisibility = _.get(req, 'body.siteVisibility');

  if (!siteName || !siteVisibility) {
    return res.render('error', { error: 'Site name and site visibility must be specified.', title: errorTitle, returnLink: errorReturnLink });
  }

  const newSiteKey = SiteLib.generateSiteKeyFromName(siteName);

  return SitesModel.getSiteByKey(newSiteKey, (findErr, findData) => {
    if (findData) {
      return res.render('error', { error: `siteKey "${newSiteKey}" already exists`, title: errorTitle, returnLink: errorReturnLink });
    }

    // if no site with that key found then proceed with creating one
    const newSiteData = SiteLib.createSiteObject({ siteName, siteVisibility });
    console.log('inserting newSiteData', newSiteData);

    return SitesModel.registerNewSite(newSiteData, (insertErr, insertData) => {
      if (insertErr || !insertData) {
        return res.render('error', { error: insertErr || 'insertData empty', title: errorTitle, returnLink: errorReturnLink });
      }

      console.log(`siteKey "${newSiteData.siteKey}" inserted correctly`);

      return res.render('add-site/add-site-success', { site: newSiteData });
    });
  });
};
