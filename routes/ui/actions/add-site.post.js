'use strict';

// const context = require('../../context');
const _ = require('lodash');

const SitesModel = require('../../../models/mongo').sites;
const SiteLib = require('../../../lib/site');

module.exports = (req, res) => {
  // console.log('req.body', req.body);
  // console.log('req.query', req.query);

  const userinput = _.get(req, 'body', {});

  if (!userinput.siteName || !userinput.siteVisibility) {
    return res.render('add-site/add-site-error', { error: 'Site name and site visibility must be specified.' });
  }
  const projectedSiteKey = SiteLib.generateSiteKeyFromName(userinput.siteName);
  SitesModel.find({ siteKey: projectedSiteKey }, (findErr, findData) => {
    if (findData && findData.length) {
      return res.render('add-site/add-site-error', { error: `siteKey "${projectedSiteKey}" already exists` });
    }

    const newSiteData = SiteLib.createSiteObject(userinput);
    console.log('inserting newSiteData', newSiteData);

    // if no site with that key found then proceed with creating one
    SitesModel.insertOne(newSiteData, (insertErr, insertData) => {
      if (insertErr || !insertData) {
        return res.render('add-site/add-site-error', { error: insertErr || 'insertData empty' });
      }
      console.log(`siteKey "${userinput.siteKey}" inserted correctly`);
      // console.log(insertData);

      return res.render('add-site/add-site-success', { site: newSiteData });
    });
  });
};
