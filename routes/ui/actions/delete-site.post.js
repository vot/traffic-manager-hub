const _ = require('lodash');

const SitesModel = require('../../../models/sites');

module.exports = (req, res) => {
  const siteKey = _.get(req, 'body.siteKey');
  const siteSecret = _.get(req, 'body.siteSecret');

  return SitesModel.getSiteByKey(siteKey, (findErr, siteData) => {
    if (findErr || !siteData) {
      return res.send('Site not found');
    }

    if (siteData.siteKey !== siteKey || siteData.siteSecret !== siteSecret) {
      return res.send('Provided values do not match the site data.');
    }

    const siteId = siteData.siteId;

    return SitesModel.deleteSite({ siteId, siteSecret }, (deleteErr, deleteData) => {
      if (deleteErr || !deleteData) {
        return res.render('add-site/add-site-error', { error: deleteErr || 'deleteData empty' });
      }

      console.log(`siteKey "${siteKey}" deleted`);

      // return res.render('add-site/add-site-success', { site: newSiteData });
      return res.redirect('/');
    });
  });
};
