'use strict';

module.exports = (req, res) => {
  // timestamp greater than 1 min ago
  const redirectLocation = `/site/${req.params.siteKey}/overview`;
  console.log('catchall route!', req.url, '->', redirectLocation)

  return res.redirect(redirectLocation);
};
