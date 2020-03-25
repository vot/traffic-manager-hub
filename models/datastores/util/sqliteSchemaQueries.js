const createTableSites = `CREATE TABLE IF NOT EXISTS "sites" (
 "siteId" TEXT PRIMARY KEY UNIQUE,
 "siteName" TEXT,
 "siteVisibility" TEXT,
 "siteKey" TEXT UNIQUE,
 "siteSecret" TEXT UNIQUE
);`;

const createTableUsers = `CREATE TABLE IF NOT EXISTS "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
  "timestamp" INTEGER NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT
);`;

const createTableSamples = `CREATE TABLE IF NOT EXISTS "samples" (
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


module.exports = {
  createTableSites,
  createTableUsers,
  createTableSamples,
};
