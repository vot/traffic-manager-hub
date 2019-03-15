'use strict';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');

const config = require('./config');
const analyser = require('./lib/analyser');
const getSummaryByCriteria = require('./lib/getSummaryByCriteria');

const samplesModel = require('./models/mongo').samples;

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
    // timestamp greater than 1 min ago
    const query = {};

    samplesModel.find(query, (err, data) => {
      const summaryByIp = getSummaryByCriteria(data, 'ip', {limit: 50});
      const summaryBySessionId = getSummaryByCriteria(data, 'sessionId', {limit: 50});
      const summaryBySessionUA = getSummaryByCriteria(data, 'userAgent', {limit: 50});

      return res.render('home', {isHomepage: true, data: {summaryByIp, summaryBySessionId, summaryBySessionUA}});
    });
  });

  app.get('/api', (req, res) => {
    // todo write this logic
    return res.render('api');
  });

  app.get('/dashboard', (req, res) => {
    // todo write this logic
    return res.render('dashboard');
  });

  app.get('/request-log', (req, res) => {
    // timestamp greater than 1 min ago
    const query = {};

    samplesModel.find(query, (err, data) => {
      return res.render('request-log', {data});
    });
  });

  app.get('/login', (req, res) => {
    // todo write this logic
    return res.render('login');
  });

  app.use('/api', jsonParser);

  app.post('/api/v1/site/:siteId/submitSamples', require('./routes/api/v1/site/submitSamples.post.js'));


  app.get('/api/v1/site/:siteId/count/ip', (req, res) => {
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
