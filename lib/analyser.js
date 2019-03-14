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

function analyseSamples(samples) {
  if (!Array.isArray(samples)) {
    console.error('Invalid samples provided', samples);
    return [];
  }
  return _.map(samples, analyseOneSample);
}

module.exports = {
  analyseSamples
};
