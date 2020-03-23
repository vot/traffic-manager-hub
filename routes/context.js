'use strict';

const _ = require('lodash');

const SitesModel = require('../models/sites');
// const samplesModel = require('../models/mongo').samples;

function getGlobalData(callback) {
  const rtn = {
    allSites: [],
    ui: {
      wrapperClass: 'tm-bg-gradient'
    }
  };

  SitesModel.getAllSites((allSitesErr, allSitesData) => {
    rtn.allSites = allSitesData;
    return callback(allSitesErr, rtn);
  });
}

function getContext(req, callback) {
  const thisSiteKey = _.get(req, 'params.siteKey', '');

  getGlobalData((globalContextErr, globalContextData) => {
    // getOneSiteSamples(thisSiteKey, (thisSiteErr, thisSiteSamples) => {
    const allSitesMeta = globalContextData.allSites || [];
    const thisSiteMeta = _.find(allSitesMeta, { siteKey: thisSiteKey });

    const thisSiteContext = {
      meta: thisSiteMeta,
      // samples: thisSiteSamples,
      activeTab: 'summary'
    };

    const fullContext = _.extend({}, globalContextData, { thisSite: thisSiteContext });

    return callback(null, fullContext);
    // });
  });
}

module.exports = {
  getContext,
};
