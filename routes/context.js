'use strict';

const _ = require('lodash');

const allSitesArray = [
  { id: '5c8ae4e7d3afe8a6ddfe7e33', name: 'Site 1' },
  { id: '5c8ae4e7d3afe8a6ddfe7e34', name: 'Site 2' }
];

function getGlobalContext() {
  return {
    sites: allSitesArray
  };
}

function getUIContext() {
  return {
    wrapperClass: 'x-bg-gradient'
  };
}

function getSiteContext(req) {
  const siteId = _.get(req, 'params.siteId');

  return _.find(allSitesArray, { id: siteId });
}

function getFullContext(req) {
  return {
    global: getGlobalContext(),
    ui: getUIContext(),
    site: getSiteContext(req)
  };
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
  getGlobalContext,
  getUIContext,
  getSiteContext,
  getFullContext,
  mapRelativeTime
};
