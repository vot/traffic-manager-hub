'use strict';

const _ = require('lodash');
const analyser = require('../../../../lib/analyser');
const samplesModel = require('../../../../models/mongo').samples;

module.exports = (req, res) => {
  const samples = _.get(req, 'body.samples');
  const machineId = _.get(req, 'body.machineId');
  const siteAuthId = req.params.siteId;
  const siteAuthSecret = _.get(req, 'body.authSecret');

  // validate secret here

  console.log('Received samples from', machineId || req.ip);

  const processed = analyser.analyseSamples(samples, { siteId: siteAuthId });

  // store samples
  samplesModel.insertMany(processed, (err, result) => {
    if (err) {
      return res.json({success: false, error: err.toString()});
    }
    return res.json({success: true});
  });

};
