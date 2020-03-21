'use strict';

const _ = require('lodash');

const context = require('../../context');
const samplesModel = require('../../../models/mongo').samples;

module.exports = (req, res) => {
  // timestamp greater than 1 min ago
  // const siteId = req.params.siteId;
  // const siteId = res.locals;
  const qFrame = req.query.frame || 'last-60';
  const query = { };

  if (qFrame !== 'all') {
    const sampleFromTimestamp = context.mapRelativeTime(qFrame);
    query.timestamp = {
      $gte: sampleFromTimestamp
    };
  }


  context.getContext(req, (ctxErr, ctxData) => {
    const currentSiteId = _.get(ctxData, 'thisSite.meta.siteId');
    if (!currentSiteId) {
      return res.render('error', { error: 'Not in a site context.' });
    }

    query.siteId = currentSiteId;

    return samplesModel.find(query, (err, logData) => {
      const locals = {
        log: logData
      };
      const newContext = _.merge(ctxData, { locals }, { thisSite: { activeTab: 'log-viewer' } });


      // console.log('newContext:', newContext);
      // console.log('Log hits:', logData.length);

      return res.render('site/log-viewer', newContext);
    });
  });
};
