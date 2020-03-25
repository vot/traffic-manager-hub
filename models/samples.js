const _ = require('lodash');
const datastores = require('./datastores');
const mapRelativeTime = require('../lib/mapRelativeTime');

const selectedDatastore = datastores.autoselect();
const MongoSamplesCollection = datastores.mongo.samples;
const sqlite = datastores.sqlite;

/**
 * Count samples for a given site
 *
 * @param {object} opts Options with signature of `{ siteId, ip, tsFrom }`
 * @callback (err, count) Returns error object or integer with result count
 */
function getSamplesCount(opts, callback) {
  if (selectedDatastore === 'mongo') {
    const mongoQuery = {
      siteId: opts.siteId,
      timestamp: {
        $gte: opts.tsFrom,
      }
    };
    if (opts.ip) {
      mongoQuery.ip = opts.ip;
    }
    if (opts.status) {
      mongoQuery.status = opts.status;
    }

    return MongoSamplesCollection.count(mongoQuery, callback);
  }

  return datastores.sqlite.countSamples(opts, callback);
}

/**
 * Generates traffic "load average" summary
 * Wrapper function - makes three getSamplesCount queries and aggregates them.
 */
function getTrafficLoadAvg(opts, callback) {
  const lastHourQuery = {
    siteId: opts.siteId,
    tsFrom: mapRelativeTime('now-60')
  };

  const lastHourBlockedQuery = {
    siteId: opts.siteId,
    status: 429,
    tsFrom: mapRelativeTime('now-60')
  };

  const last24HQuery = {
    siteId: opts.siteId,
    tsFrom: mapRelativeTime('now-1440')
  };

  getSamplesCount(lastHourQuery, (lastHourCountErr, lastHourCount) => {
    if (lastHourCountErr) {
      console.log('lastHourCountErr', lastHourCountErr);
    }

    // console.log('lastHourCount', lastHourCount);

    getSamplesCount(last24HQuery, (last24HCountErr, last24HCount) => {
      if (last24HCountErr) {
        console.log('last24HCountErr', last24HCountErr);
      }

      getSamplesCount(lastHourBlockedQuery, (lastHourBlockedCountErr, lastHourBlockedCount) => {
        if (lastHourBlockedCountErr) {
          console.log('lastHourBlockedCountErr', lastHourBlockedCountErr);
        }

        // console.log('lastHourBlockedCount', lastHourBlockedCount);

        const totals = {
          requestsLastHour: Number(lastHourCount),
          requestsLast24Hours: Number(last24HCount),

          requestsFrameAvg: _.round((lastHourCount / 60), 2),
          requests24hAvg: _.round((last24HCount / 1440), 2),

          blockedLastHour: lastHourBlockedCount,
          blockedFrameAvg: _.round((lastHourBlockedCount / 60), 2),

          // iphops: ipHopsLastHourCount,
          // iphopsFrameAvg: _.round((ipHopsLastHourCount / 60), 2),
        };

        return callback(null, totals);
      });
    });
  });
}

function getSamples(opts, callback) {
  if (selectedDatastore === 'mongo') {
    const mongoQuery = {
      siteId: opts.siteId,
      timestamp: {
        $gte: opts.tsFrom,
      }
    };
    return MongoSamplesCollection.find(mongoQuery, callback);
  }

  return sqlite.findSamples({ siteId: opts.siteId, }, callback);
}

function insertSamples(samples, callback) {
  if (selectedDatastore === 'mongo') {
    return MongoSamplesCollection.insertMany(samples, callback);
  }

  return sqlite.insertManySamples(samples, callback);
}

module.exports = {
  getSamplesCount,
  getTrafficLoadAvg,
  getSamples,
  insertSamples,
};
