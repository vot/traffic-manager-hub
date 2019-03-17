'use strict';

const _ = require('lodash');
const analyser = require('../../../../lib/analyser');
const samplesModel = require('../../../../models/mongo').samples;

module.exports = (req, res) => {
  const samples = _.get(req, 'body.samples');
  const instanceId = _.get(req, 'body.instanceId');
  const siteAuthId = req.params.siteId;
  const siteAuthSecret = _.get(req, 'body.siteSecret');

  // get site record and validate secret here


  console.log('Received samples from', instanceId || req.ip);

  const processed = analyser.analyseSamples({ instanceId, siteId: siteAuthId, samples });

  // store samples
  samplesModel.insertMany(processed, (err, result) => {
    if (err) {
      return res.json({ success: false, error: err.toString() });
    }
    return res.json({ success: true });
  });
};
