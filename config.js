'use strict';

const appPortRaw = process.env.PORT;
const appPortParsed = parseInt(appPortRaw, 10);
const appPort = (appPortRaw == appPortParsed) ? appPortParsed : 4000;
const baseUrlRaw = process.env.BASE_URL;

const config = {
  baseUrl: baseUrlRaw || 'http://localhost:' + appPort,
  appPort
};

const sites = {
  ExampleWebApp: {
    ignoreMaps: ['sensitive'],
    customMap: {
      '/': 'homepage',
      '/secret/': 'restricted secret',
    }
  }
};

config.sites = sites;

module.exports = config;
