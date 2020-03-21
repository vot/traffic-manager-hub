'use strict';

const _ = require('lodash');

const map = require('./map.json');

function getRequestTags(url) {
  if (typeof url !== 'string') {
    return false;
  }

  const urlLowercase = url.toLowerCase();

  const matchedTags = _.find(map, (tags, pattern) => {
    return _.includes(urlLowercase, pattern);
  });

  return matchedTags;
}

module.exports = {
  getRequestTags
};
