// 'use strict';
//
// const LOG_LIMIT = 5;
//
// const _ = require('lodash');
// const config = require('../config');
// const storage = require('../lib/storage');
// const generateFrameSummaryMessage = require('./formatters/summary').generateFrameSummaryMessage;
// const logSummary = require('./formatters/summary').logSummary;
//
//
// function reportFrame(frame) {
//   const now = Date.now();
//   const sortedIPs = storage.getSummaryByCriteria('ip', {limit: LOG_LIMIT});
//   const sortedSessions = storage.getSummaryByCriteria('sessionId', {limit: LOG_LIMIT});
//   const tagSummary = storage.getSummaryByCriteria('tag');
//   const systemStats = storage.getSystemStats();
//
//   const summaryMessage = generateFrameSummaryMessage(sortedIPs, sortedSessions, systemStats);
//
//   // if (Object.keys(sortedIPs).length) {
//   //   const slackData = {
//   //     message: summaryMessage,
//   //     // instanceId: 'localhost #0',
//   //     timestamp: now
//   //   };
//   //
//   //   slackData.stats = systemStats;
//   //   slackData.tagSummary = tagSummary;
//   //
//   //   logSummary(slackData);
//   // }
//
//   console.log(frame);
// }
//
// module.exports = {
//   reportFrame
// };
//
//
//
//   // const slackEnabled = config.get('reporters.slack.enabled', false);
//   // const slackHookURL = config.get('reporters.slack.hookUrl', '');
//   //
//   // // optional Slack integration
//   // if (slackEnabled && typeof slackHookURL === 'string' && slackHookURL.length) {
//   //   const tsAsString = data.timestamp.toString();
//   //   const tsNonprecise = tsAsString.substr(0, (tsAsString.length - 3));
//   //
//   //   const slackMsg = {
//   //     // text: msg,
//   //     username: 'Traffic Monitoring',
//   //     icon_emoji: ':gear:', // jshint ignore:line
//   //     attachments: [
//   //       {
//   //         title: 'Access Log insights',
//   //         pretext: `Requests in the last ${MONITORING_FRAME_SEC} seconds`,
//   //         fallback: data.message,
//   //         text: data.message,
//   //         color: '#3A4',
//   //         'footer': data.instanceId,
//   //         'ts': tsNonprecise,
//   //         fields: [
//   //           {
//   //             'title': 'Total requests',
//   //             value: `${data.stats.total} (${minuteRate}/min)`
//   //           },
//   //           {
//   //             'title': 'Blocked requests',
//   //             'value': blockedRequestsCounter
//   //           },
//   //           {
//   //             'title': 'Request type breakdown',
//   //             'value': tagSummaryString
//   //           }
//   //         ]
//   //       }
//   //     ]
//   //   };
//   //
//   //   slackLib.notify(slackMsg, '/services/' + slackHookURL, (err) => {});
//   // }
