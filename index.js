'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');

const config = require('./config');

const jsonParser = bodyParser.json();

function startApp() {
  const app = express();
  const partialsPath = path.join(__dirname, 'views/partials');

  app.disable('x-powered-by');

  hbs.registerPartials(partialsPath);
  app.engine('hbs', hbs.__express);

  /* HBS helpers */
  hbs.registerHelper('json', (input) => {
    return JSON.stringify(input, null, 2);
  });

  hbs.registerHelper('timestampToTime', (input) => {
    const timeObject = new Date(Number(input));
    return timeObject.toISOString();
  });

  app.set('view engine', 'hbs');

  app.use('/public', express.static('public'));


  /* Routes */
  /* eslint-disable global-require */
  app.get('/', require('./routes/ui/overview.get'));
  app.get('/api', require('./routes/ui/api.get'));
  app.get('/readme', require('./routes/ui/readme.get'));
  app.get('/login', require('./routes/ui/login.get'));

  app.get('/site/:siteId/summary', require('./routes/ui/site/summary.get'));
  app.get('/site/:siteId/log-viewer', require('./routes/ui/site/log-viewer.get'));
  app.get('/site/:siteId/settings', require('./routes/ui/site/settings.get'));


  app.use('/api', jsonParser);
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
    console.log(`TrafficManager HQ listening on port ${config.appPort}`);
  });

  return app;
}

startApp();
