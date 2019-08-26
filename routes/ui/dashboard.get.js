'use strict';

const async = require('async');
const _ = require('lodash');

const context = require('../context');
const SamplesModel = require('../../models/mongo').samples;

module.exports = (req, res) => {
  context.getContext(req, (ctxErr, ctxData) => {

    console.log('ctxData', ctxData);

    let fullContext = _.merge({}, ctxData);

    async.each(fullContext.allSites, (site, cb) => {

      const lastHourQuery = {
        siteId: site.siteId,
        timestamp: {
          $gte: context.mapRelativeTime('last-60')
        }
      };

      const lastHourBlockedQuery = {
        siteId: site.siteId,
        status: 429,
        timestamp: {
          $gte: context.mapRelativeTime('last-60')
        }
      };

      const last24HQuery = {
        siteId: site.siteId,
        timestamp: {
          $gte: context.mapRelativeTime('last-1440')
        }
      };

      SamplesModel.count(lastHourQuery, (countErr, lastHourCount) => {
        if (countErr) {
          console.log('countErr', countErr);
        }

        console.log('lastHourCount', lastHourCount);

        SamplesModel.count(last24HQuery, (countErr, last24HCount) => {
          if (countErr) {
            console.log('countErr', countErr);
          }
          SamplesModel.count(lastHourBlockedQuery, (countErr, lastHourBlockedCount) => {
            if (countErr) {
              console.log('countErr', countErr);
            }

            console.log('lastHourBlockedCount', lastHourBlockedCount);

            const totals = {
              requests: lastHourCount,
              requestsFrameAvg: _.round((lastHourCount / 60), 2),
              requests24hAvg: _.round((last24HCount / 1440), 2),

              blocked: lastHourBlockedCount,
              blockedFrameAvg: _.round((lastHourBlockedCount / 60), 2),

              // iphops: ipHopsLastHourCount,
              // iphopsFrameAvg: _.round((ipHopsLastHourCount / 60), 2),
            };


            const currentIndex = _.findIndex(fullContext.allSites, { siteId: site.siteId });

            console.log('currentIndex found', currentIndex);

            const newSiteObject = _.merge(fullContext.allSites[currentIndex], { totals });

            _.set(fullContext, `allSites.${currentIndex.toString()}`, newSiteObject);

            cb();
          });
        });
      });
    },
    () => {
      // get all sites data ?
      return res.render('dashboard', fullContext);
    });
  });
};
