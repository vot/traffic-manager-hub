const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const sqlite3 = require('sqlite3').verbose();
const sqliteSchemaQueries = require('./util/sqliteSchemaQueries');

const homedir = os.homedir();
const datadir = `${homedir}/.traffic-manager-hub`;

try {
  fs.mkdirSync(datadir);
  console.log(`Data directory does not exist. Creating now: ${datadir}`);
} catch (err) {
  if (err && err.code !== 'EEXIST') {
    console.error(err);
  }
}

const configDb = new sqlite3.Database(`${datadir}/config.sqlite`);
const samplesDb = new sqlite3.Database(`${datadir}/samples.sqlite`);
// const samplesDb = new sqlite3.Database(':memory:');

function initDatabase() {
  configDb.run(sqliteSchemaQueries.createTableSites);
  configDb.run(sqliteSchemaQueries.createTableUsers);
  samplesDb.run(sqliteSchemaQueries.createTableSamples);
  // console.log('SQLite database initialised successfully.');
}

initDatabase();

// //////////////////

function insertOneSite(siteData, callback) {
  // console.log('siteData', siteData);

  const mapped = {
    $siteId: siteData.siteId,
    $siteName: siteData.siteName,
    $siteVisibility: siteData.siteVisibility,
    $siteKey: siteData.siteKey,
    $siteSecret: siteData.siteSecret,
  };

  const query = 'INSERT INTO sites VALUES ($siteId, $siteName, $siteVisibility, $siteKey, $siteSecret)';
  // console.log('insert query', query, mapped);

  configDb.run(query, mapped);

  // configDb.close();
  callback(null, siteData);
}

function findSites(query, callback) {
  let sqlQuery = 'SELECT * FROM sites';
  if (query.siteKey) sqlQuery += ` WHERE siteKey = "${query.siteKey}" `;
  if (query.siteId) sqlQuery += ` WHERE siteId = "${query.siteId}" `;

  configDb.all(sqlQuery, callback);
}

function updateOneSite(query, siteData, callback) {
  // return callback('SQLite deleteSite not ready yet');
  let sqlQuery = 'UPDATE sites';
  sqlQuery += ` SET siteKey = "${siteData.siteKey}" `;
  sqlQuery += ` AND siteName = "${siteData.siteName}" `;
  sqlQuery += ` AND siteVisibility = "${siteData.siteVisibility}" `;
  sqlQuery += ` WHERE siteId = "${query.siteId}" `;

  configDb.run(sqlQuery);
  return callback(null, true);
}

function deleteOneSite(query, callback) {
  // return callback('SQLite deleteSite not ready yet');
  let sqlQuery = 'DELETE FROM sites';
  sqlQuery += ` WHERE siteId = "${query.siteId}" `;
  sqlQuery += ` AND siteSecret = "${query.siteSecret}" `;

  configDb.run(sqlQuery);
  return callback(null, true);
}


/**
 * SAMPLES FUNCTIONS
 */

function findSamples(query, callback) {
  let sqlQuery = 'SELECT * FROM samples';
  sqlQuery += ` WHERE siteId = "${query.siteId}" `;
  if (query.tsFrom && query.tsTo) sqlQuery += `AND timestamp BETWEEN ${query.tsFrom} AND ${query.tsTo}`;

  samplesDb.all(sqlQuery, callback);
}

function countSamples(query, callback) {
  let sqlQuery = 'SELECT COUNT(*) FROM samples';
  sqlQuery += ` WHERE siteId = "${query.siteId}" `;
  if (query.tsFrom && query.tsTo) sqlQuery += `AND timestamp BETWEEN ${query.tsFrom} AND ${query.tsTo}`;

  // samplesDb.get(sqlQuery, callback);
  samplesDb.get(sqlQuery, (err, data) => {
    const rtn = _.get(data, 'COUNT(*)', 0);
    callback(err, rtn);
  });
}


function insertManySamples(samples, callback) {
  samplesDb.serialize(() => {
    const stmt = samplesDb.prepare('INSERT INTO samples VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    _.each(samples, (smp) => {
      // stmt.run(null, `Nice Display Name Ipsum`, 'Public', `asdf`, `qwer`);
      // id, smp.timestamp, smp.siteId, smp.instanceId, smp.url, smp.ip, smp.sessionId, smp.userAgent, smp.statusCode, smp.responseSize, smp.timeProcessing
      stmt.run(
        null,
        smp.timestamp,
        smp.siteId,
        smp.instanceId,
        smp.url,
        smp.ip,
        smp.sessionId,
        smp.userAgent,
        smp.statusCode,
        smp.responseSize,
        smp.timeProcessing
      );
    });
    stmt.finalize();
  });

  // samplesDb.close();
  callback(null, true);
}

module.exports = {
  findSites,
  insertOneSite,
  updateOneSite,
  deleteOneSite,

  findSamples,
  countSamples,
  insertManySamples,
};
