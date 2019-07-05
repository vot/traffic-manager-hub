'use strict';

const _ = require('lodash');

const sitesModel = require('../models/mongo').sites;
const samplesModel = require('../models/mongo').samples;

// const allSitesArray = [
//   { id: '5c8ae4e7d3afe8a6ddfe7e33', name: 'Site 1' },
//   { id: '5c8ae4e7d3afe8a6ddfe7e34', name: 'Site 2' }
// ];

function getGlobalData(callback) {
  const rtn = {
    allSites: [],
    ui: {
      wrapperClass: 'x-bg-gradient'
    }
  };

  sitesModel.find({}, (allSitesErr, allSitesData) => {
    rtn.allSites = allSitesData;
    return callback(allSitesErr, rtn);
  });
}

function getOneSiteSamples(siteKey, callback) {
  if (!siteKey.length) {
    return callback();
  }

  const ts15MinAgo = (Date.now() / 1000) - 900;
  const samplesQuery = { siteKey, timestamp: { $gte: ts15MinAgo } };

  return samplesModel.find(samplesQuery, (samplesErr, samplesData) => {
    return callback(samplesErr, samplesData);
  });
}

function getContext(req, callback) {
  const thisSiteKey = _.get(req, 'params.siteKey', '');

  getGlobalData((globalContextErr, globalContextData) => {
    getOneSiteSamples(thisSiteKey, (thisSiteErr, thisSiteSamples) => {
      const allSitesMeta = globalContextData.allSites || [];
      const thisSiteMeta = _.find(allSitesMeta, { siteKey: thisSiteKey });

      const thisSiteContext = {
        meta: thisSiteMeta,
        samples: thisSiteSamples,
        activeTab: 'summary'
      };

      const fullContext = _.extend({}, globalContextData, { thisSite: thisSiteContext });

      return callback(null, fullContext);
    });
  });
}

function mapRelativeTime(inputString) {
  const now = Date.now();
  let rtn = now;

  let offsetMin = 10;
  let offsetSec;

  if (inputString.startsWith('last-')) {
    offsetMin = inputString.substr(5);
  }
  console.log('offsetMin', offsetMin);

  if (offsetMin) {
    offsetSec = offsetMin * 60;
  }
  console.log('offsetSec', offsetSec);

  if (offsetSec) {
    rtn = now - (offsetSec * 1000);
  }

  return rtn;
}

module.exports = {
  getContext,
  mapRelativeTime
};
