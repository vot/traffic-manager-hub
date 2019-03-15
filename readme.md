# Traffic Manager Hub

Web service for aggregation and analysis of your web app traffic.

Register site in the Web UI to obtain Site ID and Site Secret.

## Starting the service

`MONGO_URL=mongodb://localhost:27017 MONGO_DBNAME=traffic-manager-hub PORT=4000 node index.js`


## Integrating from Node app

Simply integrate `@cambridgecore/traffic-manager-agent` middleware in your app
and you're good to go.


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
