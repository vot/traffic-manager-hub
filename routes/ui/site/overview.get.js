'use strict';

const _ = require('lodash');

const context = require('../../context');
const SamplesModel = require('../../../models/samples');
// const getSummaryByCriteria = require('../../../lib/getSummaryByCriteria');

module.exports = (req, res) => {
  context.getContext(req, (ctxErr, ctxData) => {
    const currentSiteId = _.get(ctxData, 'thisSite.meta.siteId');
    if (!currentSiteId) {
      return res.render('error', { error: 'Not in a site context.' });
    }

    return SamplesModel.getTrafficLoadAvg({ siteId: currentSiteId }, (avgErr, avgTotals) => {
      const locals = {
        totals: avgTotals,
        // summary: {
        //   byIp: getSummaryByCriteria(logData, 'ip', { limit: 50 }),
        //   bySessionId: getSummaryByCriteria(logData, 'sessionId', { limit: 50 }),
        //   bySessionUA: getSummaryByCriteria(logData, 'userAgent', { limit: 50 })
        // },
      };
      const newContext = _.merge(ctxData, locals, { thisSite: { activeTab: 'overview' } });
      // console.log('locals', locals);

      return res.render('site/overview', newContext);
    });
  });
};
