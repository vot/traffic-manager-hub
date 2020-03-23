'use strict';

const async = require('async');
const _ = require('lodash');

const context = require('../context');
const SamplesModel = require('../../models/samples');

module.exports = (req, res) => {
  context.getContext(req, (ctxErr, ctxData) => {
    // console.log('ctxData', ctxData);

    const fullContext = _.merge({}, ctxData);

    async.each(fullContext.allSites, (site, cb) => {
      SamplesModel.getTrafficLoadAvg({ siteId: site.siteId }, (avgErr, avgTotals) => {
        if (avgErr) {
          return cb();
        }

        const currentIndex = _.findIndex(fullContext.allSites, { siteId: site.siteId });

        // set data for the site in main context object
        const newSiteObject = _.merge(fullContext.allSites[currentIndex], { totals: avgTotals });
        _.set(fullContext, `allSites.${currentIndex.toString()}`, newSiteObject);

        return cb();
      });
    },
    () => {
      // get all sites data ?
      return res.render('dashboard', fullContext);
    });
  });
};
