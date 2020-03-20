# Traffic Manager Hub

Web service for aggregation and analysis of your web app traffic.

Hub is the component that acts as a C&C application (command and control)
for Traffic Manager.


## Starting the service

There two ways of starting the application:

* `node main.js`
* `npm run start`

Developers will find `npm run start` familiar but not useful in environments
without npm installed (i.e. Alpine Node images).

## Configuration

This service uses these env vars for configuration:

* `MONGO_URL`
* `MONGO_DBNAME`
* `PORT`
* `BASE_URL`


**Example**

`MONGO_URL=mongodb://localhost:27017 MONGO_DBNAME=tmhub PORT=80 BASE_URL=http://tmhub.example.com/ npm run start`


## Integrating Traffic Manager Hub with your app

_To integrate with Traffic Manager Hub you'll need to register your site
in the Web UI to obtain **Site ID** and **Site Secret**._


### Node app

Follow the instructions in `@vothub/traffic-manager-agent` package
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
