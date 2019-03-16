'use strict';

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');

const config = require('./config');
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


  /* Routes */
  const rootContext = {wrapperClass: 'bg-gradient'};
  const siteContext = {site: {id: '5c8ae4e7d3afe8a6ddfe7e33', name: 'Site 1'}, wrapperClass: 'bg-gradient'};
  const sites = [{id: '5c8ae4e7d3afe8a6ddfe7e33', name: 'Site 1'}];

  app.get('/', (req, res) => {
    return res.render('home', {context: rootContext, data: {sites}});
  });

  app.get('/api', (req, res) => {
    // todo write this logic
    return res.render('api', {context: rootContext});
  });

  app.get('/readme', (req, res) => {
    // todo write this logic
    return res.render('readme', {context: rootContext});
  });

  // app.get('/login', (req, res) => {
  //   // todo write this logic
  //   return res.render('login');
  // });

  app.get('/site/:siteId/summary', (req, res) => {
    // timestamp greater than 1 min ago
    const query = {};

    samplesModel.find(query, (err, data) => {
      const summaryByIp = getSummaryByCriteria(data, 'ip', {limit: 50});
      const summaryBySessionId = getSummaryByCriteria(data, 'sessionId', {limit: 50});
      const summaryBySessionUA = getSummaryByCriteria(data, 'userAgent', {limit: 50});

      return res.render('site/summary', {context: siteContext, data: {summaryByIp, summaryBySessionId, summaryBySessionUA}});
    });
  });


  app.get('/site/:siteId/log-viewer', (req, res) => {
    // timestamp greater than 1 min ago
    const query = {};

    samplesModel.find(query, (err, data) => {
      return res.render('site/log-viewer', {context: siteContext, data});
    });
  });

  app.get('/site/:siteId/settings', (req, res) => {
    return res.render('site/settings', {context: siteContext});
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
