const _ = require('lodash');
const fs = require('fs');
const os = require('os');
const sqlite3 = require('sqlite3').verbose();

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
const dataDb = new sqlite3.Database(`${datadir}/data.sqlite`);
// const dataDb = new sqlite3.Database(':memory:');

const createTableQuerySites = `CREATE TABLE IF NOT EXISTS "sites" (
 "id" INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
 "displayName" TEXT,
 "visibility" TEXT,
 "key" TEXT UNIQUE,
 "secret" TEXT UNIQUE
);`;

const createTableQueryUsers = `CREATE TABLE IF NOT EXISTS "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
  "timestamp" INTEGER NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT
);`;

const createTableQuerySamples = `CREATE TABLE IF NOT EXISTS "samples" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
  "timestamp" INTEGER NOT NULL,
  "siteId" TEXT NOT NULL,
  "instanceId" TEXT,
  "url" TEXT NOT NULL,
  "ip" TEXT NOT NULL,
  "sessionId" TEXT,
  "userAgent" TEXT,
  "statusCode" INTEGER,
  "responseSize" INTEGER,
  "timeProcessing" INTEGER
);`;

function initDatabase() {
  configDb.serialize(() => {
    configDb.run(createTableQuerySites);
    configDb.run(createTableQueryUsers);
    dataDb.run(createTableQuerySamples);
  });
  // console.log('SQLite database initialised successfully.');
  configDb.close();
}

initDatabase();

// //////////////////

function insertOneSite(siteData, callback) {
  configDb.serialize(() => {
    const query = `INSERT INTO sites VALUES (null, ${siteData.displayName}, ${siteData.visibility}, ${siteData.key}, ${siteData.secret})`;
    configDb.run(query);
  });
  configDb.close();
  callback();
}

function insertManySamples(samples, callback) {
  dataDb.serialize(() => {
    const stmt = dataDb.prepare('INSERT INTO samples VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

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

    console.log('initialised!');
    callback();
  });
  dataDb.close();
}


function findSites(query, callback) {
  configDb.each('SELECT id AS id, displayName FROM sites', (err, row) => {
    console.log(`${row.id}: ${row.displayName}`);
    callback();
  });
}

function findSamples(query, callback) {
  dataDb.each('SELECT id AS id, displayName FROM samples', (err, row) => {
    console.log(`${row.id}: ${row.displayName}`);
    callback();
  });
}

module.exports = {
  findSites,
  insertOneSite,
  // updateOneSite,
  // deleteOneSite,
  findSamples,
  insertManySamples,
  // countSamples,
};
