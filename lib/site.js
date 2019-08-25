const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const base64 = require('base-64');

function generateSiteId() {
  return uuidv4().replace(/-/g, '');
}

function generateSiteSecret() {
  return base64.encode(generateSiteId());
}

/**
 * Does very basic transformation from siteName to a tokenised siteKey
 *
 * For example generateSiteKeyFromName('  My Test Website (prod)')
 * returns 'my-test-website-prod'
 */
function generateSiteKeyFromName(name) {
  if (typeof name !== 'string') {
    return '';
  }

  let rtn = name;
  rtn = rtn.trim();
  rtn = rtn.toLowerCase();

  rtn = rtn.replace(/[^a-z\d:]/g, '-');
  rtn = rtn.replace(/--/g, '-');

  if (rtn.startsWith('-')) {
    rtn = rtn.substring(1, rtn.length);
  }

  if (rtn.endsWith('-')) {
    rtn = rtn.substring(0, rtn.length - 1);
  }

  return rtn;
}

function createSiteObject(data) {
  const blankSiteObject = {
    siteKey: null,
    siteName: null,
    siteVisibility: null,
    siteId: null,
    siteSecret: null
  };

  const newSiteObject = _.merge({}, blankSiteObject, data);

  newSiteObject.siteName = newSiteObject.siteName.trim();

  if (!newSiteObject.siteKey || !newSiteObject.siteKey.length) {
    newSiteObject.siteKey = generateSiteKeyFromName(newSiteObject.siteName);
  }

  if (!newSiteObject.siteId || !newSiteObject.siteSecret) {
    newSiteObject.siteId = generateSiteId();
    newSiteObject.siteSecret = generateSiteSecret();
  }

  return newSiteObject;
}

module.exports = {
  createSiteObject,
  generateSiteKeyFromName
};
