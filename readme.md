# Traffic Manager Hub

Web service for aggregation and analysis of your web app traffic.

Hub is the component that acts as a C&C application (command and control)
for Traffic Manager.


## Starting the service

This service takes three env vars:

* `MONGO_URL`
* `MONGO_DBNAME`
* `PORT`
* `BASE_URL`

There are also two ways of starting the application:

* `node main.js`
* `npm run start`


**Example**

```
MONGO_URL=mongodb://localhost:27017 MONGO_DBNAME=traffic-manager-hub PORT=4000 BASE_URL=http://localhost:4000/ npm run start
```


## Integrating from Node app

Simply integrate `@vot/traffic-manager-agent` middleware in your app
and you're good to go.

To integrate with Traffic Manager Hub you'll need to register your site
in the Web UI to obtain Site ID and Site Secret.


## Integrating via HTTP

Send requests formatted like this to `/api/v1/:siteId/submitSamples`:

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
