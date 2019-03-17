'use strict';

const context = require('../context');

module.exports = (req, res) => {
  return res.render('home', context.getFullContext());
};
