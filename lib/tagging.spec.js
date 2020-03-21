'use strict';

const _ = require('lodash');
const expect = require('chai').expect;
const tagging = require('./tagging');

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
    _.each(samples, (sample) => {
      it(`should detect "${sample.expected}" in "${sample.url}"`, () => {
        const result = tagging.getRequestTags(sample.url);
        expect(result).to.equal(sample.expected);
      });
    });
  });
});
