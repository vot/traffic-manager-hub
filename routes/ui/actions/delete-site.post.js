const _ = require('lodash');

const SitesModel = require('../../../models/mongo').sites;

module.exports = (req, res) => {
  const siteKey = _.get(req, 'body.siteKey');
  const siteSecret = _.get(req, 'body.siteSecret');

  console.log('siteKey', siteKey);
  console.log('siteSecret', siteSecret);

  return SitesModel.find({ siteKey }, (findErr, findData) => {
    if (findErr || !findData || !findData.length) {
      return res.send('Site not found');
    }

    if (findData.length > 1) {
      return res.send('Matched more than one site. Aborting.');
    }

    if (findData[0].siteKey !== siteKey || findData[0].siteSecret !== siteSecret) {
      return res.send('Provided values do not match the site data.');
    }

    return SitesModel.deleteOne({ siteKey, siteSecret }, (deleteErr, deleteData) => {
      if (deleteErr || !deleteData) {
        return res.render('add-site/add-site-error', { error: deleteErr || 'deleteData empty' });
      }

      console.log(`siteKey "${siteKey}" deleted`);

      // return res.render('add-site/add-site-success', { site: newSiteData });
      return res.redirect('/');
    });
  });
};
