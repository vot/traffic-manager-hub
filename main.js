#!/usr/bin/env node
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');

const config = require('./config');
const selectedDatastore = require('./models/datastores').autoselect();

const bodyJsonParser = bodyParser.json();
const bodyFormParser = bodyParser.urlencoded({ extended: true });

function startApp() {
  const app = express();
  const publicPath = path.join(__dirname, 'public');
  const viewsPath = path.join(__dirname, 'views');
  const partialsPath = path.join(__dirname, 'views/partials');

  app.disable('x-powered-by');

  hbs.registerHelper('eq', (arg1, arg2) => {
    return arg1 === arg2;
  });

  // eslint-disable-next-line no-underscore-dangle
  app.engine('hbs', hbs.__express);

  /* HBS helpers */
  hbs.registerHelper('json', (input) => {
    return JSON.stringify(input, null, 2);
  });

  hbs.registerHelper('timestampToTime', (input) => {
    const timeObject = new Date(Number(input));
    return timeObject.toISOString();
  });

  hbs.registerPartials(partialsPath);
  app.set('views', viewsPath);
  app.set('view engine', 'hbs');

  app.use('/public', express.static(publicPath));


  /* Routes */
  /* eslint-disable global-require */
  // UI Routes
  app.get('/', require('./routes/ui/dashboard.get'));
  // app.get('/api', require('./routes/ui/api.get'));
  app.get('/readme', require('./routes/ui/readme.get'));
  app.get('/login', require('./routes/ui/login.get'));
  app.get('/add-site', require('./routes/ui/add-site.get'));

  app.get('/site/:siteKey', require('./routes/ui/site/_catchall.get'));
  app.get('/site/:siteKey/overview', require('./routes/ui/site/overview.get'));
  app.get('/site/:siteKey/log-viewer', require('./routes/ui/site/log-viewer.get'));
  app.get('/site/:siteKey/settings', require('./routes/ui/site/settings.get'));
  app.get('/site/:siteKey/*', require('./routes/ui/site/_catchall.get'));

  // UI Actions Routes
  app.use('/actions', bodyFormParser);
  app.post('/actions/add-site', require('./routes/ui/actions/add-site.post'));
  app.post('/actions/delete-site', require('./routes/ui/actions/delete-site.post'));
  app.post('/actions/update-site/site', require('./routes/ui/actions/update-site/site.post'));

  // API Routes
  app.use('/api', bodyJsonParser);
  app.post('/api/v1/site/:siteId/submitSamples', require('./routes/api/v1/site/submitSamples.post.js'));
  app.get('/api/v1/site/:siteId/count/ip', require('./routes/api/v1/site/count/ip.get.js'));


  // app.get('/api/v1/site/:siteId/summary/ip?timeStart&timeEnd');
  // app.get('/api/v1/site/:siteId/averages');
  // app.get('/api/v1/site/:siteId/config');

  // app.get('/api/v1/site/global/summary/ip?ip=1.1.1.1&timeStart&timeEnd');
  //
  // app.get('/api/v1/maps/vulnerabilities');
  /* eslint-enable global-require */

  app.listen(config.appPort, () => {
    console.log(`Traffic Manager Hub listening on port ${config.appPort}`);
    console.log(`Datastore selected: ${selectedDatastore}`);
  });

  return app;
}

startApp();
