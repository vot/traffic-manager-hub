const sqliteDatastore = require('./models/datastores/sqlite');

const sampleSite = {
  displayName: 'asdfd',
  visibility: 'asdfd',
  key: 'asdfd',
  secret: 'asdfd',
};
const samples = [
  {
    ip: '::1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    url: '/asdfgh/',
    sessionId: 'yRraL9PNvXWX21_v_9fxgrxP3MH7m6Qx',
    statusCode: 200,
    responseSize: 50687,
    timeProcessing: 1103,
    timestamp: 1584854923066,
    instanceId: 'Pluto',
    siteId: '308654cb4d5042b28f0e9dc29293d895'
  },

  {
    ip: '::1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    url: '/asdf',
    sessionId: 'yRraL9PNvXWX21_v_9fxgrxP3MH7m6Qx',
    statusCode: 200,
    responseSize: 14,
    timeProcessing: 5,
    timestamp: 1584854925523,
    instanceId: 'Pluto',
    siteId: '308654cb4d5042b28f0e9dc29293d895'
  }
];

sqliteDatastore.insertOneSite(sampleSite, (err, data) => {
  console.log('err', err);
  console.log('data', data);
});

sqliteDatastore.insertManySamples(samples, (err, data) => {
  console.log('err', err);
  console.log('data', data);
});

sqliteDatastore.findSites({}, (err, data) => {
  console.log('err', err);
  console.log('data', data);
});

sqliteDatastore.findSamples({}, (err, data) => {
  console.log('err', err);
  console.log('data', data);
});
