const _ = require('lodash');

const SitesModel = require('../../../../models/sites');

module.exports = (req, res) => {
  const siteId = _.get(req, 'body.siteId', '').trim();
  const siteName = _.get(req, 'body.siteName', '').trim();
  const siteKeyOld = _.get(req, 'body.siteKeyOld', '').trim();
  const siteKeyNew = _.get(req, 'body.siteKeyNew', '').trim();
  const siteVisibility = _.get(req, 'body.siteVisibility', '').trim();

  const errorTitle = 'Failed to update the site';
  const errorReturnLink = siteKeyOld.length ? `/site/${siteKeyOld}/settings` : null;

  if (!siteName.length || !siteKeyNew.length || !siteVisibility.length) {
    return res.render('error', {
      error: 'All values are required.',
      title: errorTitle,
      returnLink: errorReturnLink
    });
  }

  return SitesModel.getSiteByKey(siteKeyNew, (findErr, siteData) => {
    console.log('siteId', siteId);
    console.log('siteData', siteData);

    if (siteData && siteData.siteId !== siteId) {
      return res.render('error', {
        error: `Site Key "${siteKeyNew}" already exists.`,
        title: errorTitle,
        returnLink: errorReturnLink
      });
    }

    // const storedDataId = findData[0]._id;

    // if no site with that key found then proceed with creating one
    // const newSiteData = _.merge({}, storedData, { siteName, siteKey, siteVisibility });
    const newSiteData = { siteId, siteName, siteKey: siteKeyNew, siteVisibility };
    // console.log('update newSiteData', newSiteData);

    return SitesModel.updateSiteSettings(newSiteData, (updateErr, updateData) => {
      if (updateErr || !updateData) {
        return res.render('error', {
          error: updateErr || 'updateData empty',
          title: errorTitle,
          returnLink: errorReturnLink
        });
      }

      console.log(`siteKey "${newSiteData.siteKey}" updated correctly`);

      // return res.render('success', { site: newSiteData });
      return res.redirect(`/site/${newSiteData.siteKey}/settings`);
    });
  });
};
