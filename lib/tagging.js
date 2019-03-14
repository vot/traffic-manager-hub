'use strict';

const _ = require('lodash');

const map = require('./map.json');

function getRequestTags(url) {
  if (typeof url !== 'string') {
    return false;
  }

  let rtn = false;
  const urlLowercase = url.toLowerCase();

  _.each(map, (valTag, keyPattern) => {
    if (_.includes(urlLowercase, keyPattern)) {
      rtn = valTag;
      return false;
    }
  });

  return rtn;
}

module.exports = {
  getRequestTags
};
