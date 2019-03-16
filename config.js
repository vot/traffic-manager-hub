'use strict';

const appPortRaw = process.env.PORT;
const appPortParsed = parseInt(appPortRaw, 10);
const appPort = (appPortRaw == appPortParsed) ? appPortParsed : 4000;

const baseUrlRaw = process.env.BASE_URL;
const baseUrl = baseUrlRaw || 'http://localhost:' + appPort;

const mongoUrl = process.env.MONGO_URL;
const mongoDbName = process.env.MONGO_DBNAME;

const config = {
  baseUrl,
  appPort,
  mongoUrl,
  mongoDbName
};

if (!mongoUrl) {
  console.log('You must provide MONGO_URL variable.');
  process.exit(1);
}

if (!mongoDbName) {
  console.log('You must provide MONGO_DBNAME variable.');
  process.exit(2);
}

module.exports = config;
