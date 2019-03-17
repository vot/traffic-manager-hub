const _ = require('lodash');

const HARD_LIMIT = 100;

function getSummaryByCriteria(data, criteria, opts) {
  const grouped = _.groupBy(data, criteria);

  const flattened = _.map(grouped, (val, key) => {
    return { key, count: val.length };
  });

  const sorted = _.reverse(_.sortBy(flattened, 'count'));
  let rtn = sorted;

  if (opts && typeof opts.limit === 'number') {
    const actualLimit = opts.limit < HARD_LIMIT ? opts.limit : HARD_LIMIT;
    const keysToUse = _.slice(_.map(sorted, 'key'), 0, actualLimit);

    rtn = {};
    _.each(keysToUse, (key) => {
      rtn[key] = grouped[key];
    });
  }

  return rtn;
}

module.exports = getSummaryByCriteria;
