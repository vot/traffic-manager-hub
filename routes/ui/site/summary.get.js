'use strict';

const _ = require('lodash');

const context = require('../../context');
const samplesModel = require('../../../models/mongo').samples;
const getSummaryByCriteria = require('../../../lib/getSummaryByCriteria');

module.exports = (req, res) => {
  // timestamp greater than 1 min ago
  const siteId = req.params.siteId;
  const query = { siteId };

  samplesModel.find(query, (err, logData) => {
    const currentContext = context.getFullContext(req);
    const locals = {
      summary: {
        byIp: getSummaryByCriteria(logData, 'ip', { limit: 50 }),
        bySessionId: getSummaryByCriteria(logData, 'sessionId', { limit: 50 }),
        bySessionUA: getSummaryByCriteria(logData, 'userAgent', { limit: 50 })
      }
    };
    const newContext = _.merge(currentContext, locals);

    return res.render('site/summary', newContext);
  });
};
