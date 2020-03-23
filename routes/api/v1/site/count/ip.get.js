const SamplesModel = require('../../../../../models/samples');
const mapRelativeTime = require('../../../../../lib/mapRelativeTime');

module.exports = (req, res) => {
  const siteId = req.params.siteId;
  const queryIp = req.query.ip;
  const queryFrame = req.query.frame || 'last-15';

  if (!queryIp) {
    return res.json({ success: false, error: 'E_MISSING_IP' });
  }

  const sampleFromTimestamp = mapRelativeTime(queryFrame);

  const query = {
    siteId,
    ip: queryIp,
    tsFrom: sampleFromTimestamp
  };

  // count the events
  return SamplesModel.getSamplesCount(query, (err, logCount) => {
    return res.json({ success: true, count: logCount, start: sampleFromTimestamp });
  });
};
