function mapRelativeTime(inputString) {
  const now = Date.now();
  let rtn = now;

  let offsetMin = 0;
  let offsetSec;

  if (typeof inputString === 'string' && inputString.startsWith('now-')) {
    offsetMin = inputString.substr(4);
  }
  // console.log('offsetMin', offsetMin);

  if (offsetMin) {
    offsetSec = offsetMin * 60;
  }
  // console.log('offsetSec', offsetSec);

  if (offsetSec) {
    rtn = now - (offsetSec * 1000);
  }

  return rtn;
}

module.exports = mapRelativeTime;
