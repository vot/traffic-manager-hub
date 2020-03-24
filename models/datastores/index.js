const config = require('../../config');

const mongo = require('./mongo');
const sqlite = require('./sqlite');

function autoselect() {
  let selected = 'sqlite';
  const mongoConfigExists = Boolean(config.mongoUrl && config.mongoDbName);

  if (mongoConfigExists) {
    selected = 'mongo';
  }

  return selected;
}

module.exports = {
  autoselect,
  mongo,
  sqlite,
};
