const config = require('../../config');

const mongodb = require('./mongodb');
const sqlite = require('./sqlite');

function autoselect() {
  let selected = 'sqlite';
  const mongoConfigExists = Boolean(config.mongoUrl && config.mongoDbName);

  if (mongoConfigExists) {
    selected = 'mongodb';
  }

  return selected;
}

module.exports = {
  autoselect,
  mongodb,
  sqlite,
};
