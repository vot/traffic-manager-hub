'use strict';

const _ = require('lodash');

const context = require('../../context');
const samplesModel = require('../../../models/mongo').samples;

module.exports = (req, res) => {
  // timestamp greater than 1 min ago
  const siteId = req.params.siteId;
  const qFrame = req.query.frame || 'last-15';

  const sampleFromTimestamp = context.mapRelativeTime(qFrame);

  const query = {
    siteId,
    // timestamp: {
    //   $gte: sampleFromTimestamp
    // }
  };

  // console.log('query', JSON.stringify(query, null, 2));

  context.getContext(req, (ctxErr, ctxData) => {
    samplesModel.find(query, (err, logData) => {
      const locals = {
        log: logData
      };
      const newContext = _.merge(ctxData, { locals }, { thisSite: { activeTab: 'log-viewer' } });
      console.log('newContext:', newContext);
      console.log('Log hits:', logData.length);

      return res.render('site/log-viewer', newContext);
    });
  });
};
