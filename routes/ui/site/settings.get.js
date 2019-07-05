'use strict';

const _ = require('lodash');
const context = require('../../context');

module.exports = (req, res) => {
  context.getContext(req, (ctxErr, ctxData) => {
    const newContext = _.merge(ctxData, { thisSite: { activeTab: 'settings' } });

    return res.render('site/settings', newContext);
  });
};
