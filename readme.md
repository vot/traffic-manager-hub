# Traffic Manager Hub

[![NPM Version][npm-img]][npm-url]
[![NPM Downloads][npm-dl-img]][npm-url]
[![Build status][circle-img]][circle-url]
<!-- [![Coveralls coverage][coveralls-img]][coveralls-url] -->

[npm-url]: https://npmjs.org/package/traffic-manager-hub
[npm-img]: https://img.shields.io/npm/v/traffic-manager-hub.svg
[npm-dl-img]: https://img.shields.io/npm/dm/traffic-manager-hub.svg
[circle-img]: https://img.shields.io/circleci/project/github/vot/traffic-manager-hub/master.svg
[circle-url]: https://circleci.com/gh/vot/traffic-manager-hub/tree/master
<!-- [coveralls-img]: https://img.shields.io/coveralls/vot/traffic-manager-hub.svg
[coveralls-url]: https://coveralls.io/github/vot/traffic-manager-hub -->

Web service for aggregation and analysis of your web app traffic.

Hub is the component that acts as a C&C application (command and control)
for Traffic Manager.


## Quick start

To install the service globally with npm use the following command in your terminal.

```
npm install traffic-manager-hub -g
```

After successful installation you will be able to start Traffic Manager Hub
with `tmhub` command in your terminal.


## Configuration

This service uses these env vars for configuration:

* `MONGO_URL` (required)
* `MONGO_DBNAME` (required)
* `PORT` (default: `4000`)
* `BASE_URL` (default: `http://localhost:4000`)


**Example**

`MONGO_URL=mongodb://localhost:27017 MONGO_DBNAME=tmhub PORT=8000 BASE_URL=http://tmhub.example.com/ tmhub`


## Integrating Traffic Manager Hub with your app

_To integrate with Traffic Manager Hub you'll need to register your site
in the Web UI to obtain **Site ID** and **Site Secret**._


### Node app

Follow the instructions in [traffic-manager-agent package](https://npmjs.org/package/traffic-manager-agent)
to install Traffic Manager Agent in your app.

Provide URL of your TM Hub instance, Site ID and Site Secret in configuration.

Your application is now being monitored by Traffic Manager.


### Other apps

You can integrate Traffic Manager Hub with any application.

Traffic Manager Hub exposes a simple REST API.

All you have to do is to send JSON payload containing requests/events
to `/api/v1/:siteId/submitSamples`.

The payload should look like this:

```
{
	"siteSecret": "zN2EY69fmy303MUEs7ZkQv8sqeuFjFEp",
	"samples": [
		{
			"ip": "89.238.154.238",
			"url": "http://example.com/wp-login.php",
			"userAgent": "SampleUA/1.0.0",
			"timestamp": "1552604831677"
		},
		{
			"ip": "89.238.154.238",
			"url": "http://example.com/cpanel",
			"userAgent": "SampleUA/1.0.0",
			"timestamp": "1552604831681"
		}
	]
}
```

## Set up for development

Clone the repository and install the dependencies (`npm install`).

Once that's done you can start the application with `node main.js` or `npm run start`.
