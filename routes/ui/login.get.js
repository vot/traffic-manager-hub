'use strict';

const context = require('../context');

module.exports = (req, res) => {
  // todo write this logic
  context.getContext(req, (ctxErr, ctxData) => {
    return res.render('login', ctxData);
  });
};
