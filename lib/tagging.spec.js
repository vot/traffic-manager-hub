'use strict';

const _ = require('lodash');
const expect = require('chai').expect;
const tagging = require('../lib/tagging');

const samples = [
  {
    url: 'http://legiturl.com/something/wp-login.php',
    expected: 'sensitive sensitive-wordpress'
  },
  {
    url: 'http://legiturl.com/something/secret-path/admin',
    expected: 'sensitive'
  },
  {
    url: 'http://legiturl.com/something/.bitcoin',
    expected: 'vuln vuln-userdata'
  },
  {
    url: 'http://legiturl.com/something/../etc',
    expected: 'vuln vuln-serverconfig'
  },
  {
    url: 'http://legiturl.com/something/.ssh',
    expected: 'vuln vuln-serverconfig'
  },
  {
    url: 'http://legiturl.com/something/cache.php',
    expected: 'vuln vuln-php'
  },
  {
    url: 'http://legiturl.com/something/php-my-admin',
    expected: 'vuln vuln-web'
  },
  {
    url: 'http://legiturl.com/something/base64_decode',
    expected: 'vuln vuln-web'
  }
];

describe('tagging library', () => {
  describe('getRequestTags', () => {
    // it('should add ".exe" in windows-32', function () {
    //   const result = ffbinaries.getBinaryFilename('ffmpeg', 'windows-32');
    //   expect(result).to.equal('ffmpeg.exe');
    // });

    _.each(samples, (sample) => {
      it(`should detect "${sample.expected}" in "${sample.url}"`, () => {
        const result = tagging.getRequestTags(sample.url);
        expect(result).to.equal(sample.expected);
      });
    });

  });
});
