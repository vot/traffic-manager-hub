'use strict';


const samplesModel = require('../../../../../models/mongo').samples;
const context = require('../../../../context');

module.exports = (req, res) => {
  const siteId = req.params.siteId;
  const queryIp = req.query.ip;
  const queryFrame = req.query.frame || 'last-15';

  if (!queryIp) {
    return res.json({ success: false, error: 'E_MISSING_IP' });
  }

  const sampleFromTimestamp = context.mapRelativeTime(queryFrame);

  const query = {
    siteId,
    ip: queryIp,
    timestamp: {
      $gte: sampleFromTimestamp
    }
  };

  // get query
  samplesModel.count(query, (err, logCount) => {
    return res.json({ success: true, count: logCount, start: sampleFromTimestamp });
  });
};
