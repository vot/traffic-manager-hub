'use strict';

const _ = require('lodash');

const context = require('../../context');
const samplesModel = require('../../../models/mongo').samples;
// const getSummaryByCriteria = require('../../../lib/getSummaryByCriteria');

module.exports = (req, res) => {
  // timestamp greater than 1 min ago
  // const siteKey = req.params.siteKey;

  context.getContext(req, (ctxErr, ctxData) => {
    const currentSiteId = _.get(ctxData, 'thisSite.meta.siteId');
    if (!currentSiteId) {
      return res.render('error', { error: 'Not in a site context.' });
    }

    const lastHourQuery = {
      siteId: currentSiteId,
      timestamp: {
        $gte: context.mapRelativeTime('last-60')
      }
    };

    const last24HQuery = {
      siteId: currentSiteId,
      timestamp: {
        $gte: context.mapRelativeTime('last-1440')
      }
    };

    const lastHourBlockedQuery = {
      siteId: currentSiteId,
      status: 429,
      timestamp: {
        $gte: context.mapRelativeTime('last-60')
      }
    };


    samplesModel.count(lastHourQuery, (lastHourErr, lastHourCount) => {
      samplesModel.count(last24HQuery, (last24HErr, last24HCount) => {
        samplesModel.count(lastHourBlockedQuery, (countErr, lastHourBlockedCount) => {
          const locals = {
            // summary: {
            //   byIp: getSummaryByCriteria(logData, 'ip', { limit: 50 }),
            //   bySessionId: getSummaryByCriteria(logData, 'sessionId', { limit: 50 }),
            //   bySessionUA: getSummaryByCriteria(logData, 'userAgent', { limit: 50 })
            // },
            totals: {
              requests: lastHourCount,
              requestsFrameAvg: _.round((lastHourCount / 60), 2),
              requests24hAvg: _.round((last24HCount / 1440), 2),

              blocked: lastHourBlockedCount,
              blockedFrameAvg: _.round((lastHourBlockedCount / 60), 2)
            }
          };
          const newContext = _.merge(ctxData, locals, { thisSite: { activeTab: 'overview' } });
          // console.log('locals', locals);

          return res.render('site/overview', newContext);
        });
      });
    });
  });
};
