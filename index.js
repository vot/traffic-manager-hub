'use strict';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');

const config = require('./config');
const analyser = require('./lib/analyser');

const jsonParser = bodyParser.json();

function startApp() {
  const app = express();
  const partialsPath = path.join(__dirname, 'views/partials');

  app.disable('x-powered-by');

  hbs.registerHelper('json', (input) => {
    return JSON.stringify(input, null, 2);
  });
  hbs.registerPartials(partialsPath);
  app.engine('hbs', hbs.__express);
  app.set('view engine', 'hbs');

  app.use('/public', express.static('public'));

  app.get('/', (req, res) => {
    // todo get data here
    const summaryByIp = {};
    return res.render('home', {isHomepage: true, data: {byIp: summaryByIp}});
  });

  app.get('/api', (req, res) => {
    // todo write this logic
    return res.render('api');
  });

  app.get('/dashboard', (req, res) => {
    // todo write this logic
    return res.render('dashboard');
  });

  app.get('/login', (req, res) => {
    // todo write this logic
    return res.render('login');
  });

  app.use('/api', jsonParser);

  app.post('/api/v1/site/:siteId/submitSamples', (req, res) => {
    const samples = _.get(req, 'body.samples');
    const siteAuthId = req.params.siteId;
    const siteAuthSecret = _.get(req, 'body.authSecret');

    // validate secret here

    console.log('Samples submitted');

    const processed = analyser.analyseSamples(samples, { siteId: siteAuthId });
    console.log(processed);

    // store samples
    return res.json({status: 'ok'});
  });


  app.get('/api/v1/site/:siteId/count/ip?timeStart', (req, res) => {
    return res.json({status: 'ok', data: []});
  });


  // app.get('/api/v1/site/:siteId/summary/ip?timeStart&timeEnd');
  // app.get('/api/v1/site/:siteId/averages');
  // app.get('/api/v1/site/:siteId/config');

  // app.get('/api/v1/site/global/summary/ip?ip=1.1.1.1&timeStart&timeEnd');
  //
  // app.get('/api/v1/blocklist/daily/full');
  // app.get('/api/v1/blocklist/daily/security');
  // app.get('/api/v1/blocklist/daily/scrapers');
  // app.get('/api/v1/blocklist/daily/searchbots');
  //
  // app.get('/api/v1/maps/vulnerabilities');

  app.listen(config.appPort, () => {
    console.log(`TrafficManager HQ listening on port ${config.appPort}`);
  });

  return app;
}

startApp();
