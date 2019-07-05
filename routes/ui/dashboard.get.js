'use strict';

const context = require('../context');

module.exports = (req, res) => {
  context.getContext(req, (ctxErr, ctxData) => {
    return res.render('dashboard', ctxData);
  });
};
