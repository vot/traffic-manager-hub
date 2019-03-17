'use strict';

const _ = require('lodash');
const geoip = require('geoip-lite');
const tagging = require('./tagging');


/**
 * Analyses sample - assigns tags, runs GeoIP
 */
function analyseOneSample(sample) {
  const rtn = sample;
  const url = _.get(sample, 'url');
  const ip = _.get(sample, 'ip');

  const tags = tagging.getRequestTags(url);
  const geoipData = geoip.lookup(ip);

  if (tags) {
    rtn.tags = tags;
  }

  if (geoipData) {
    rtn.geoCountry = geoipData.country;
    rtn.geoCity = geoipData.city;
  }

  return rtn;
}

function analyseSamples(data) {
  const instanceId = data.instanceId;
  const siteId = data.siteId;

  if (!Array.isArray(data.samples)) {
    console.error('Invalid samples provided', data.samples);
    return [];
  }

  const samples = _.map(data.samples, (s) => {
    return _.merge(s, { instanceId, siteId });
  });

  const rtn = _.map(samples, analyseOneSample);
  console.log('rtn analysed', rtn);
  return rtn;
}

module.exports = {
  analyseSamples
};
