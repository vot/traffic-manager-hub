# Traffic Manager Agent

Web service for aggregation and analysis of your web app traffic.

## Integrating from Node app

Simply integrate `@cambridgecore/traffic-manager-agent` middleware in your app
and you're good to go.


## Integrating via HTTP

Send requests formatted like this to `https://trafficmanager.example.com/api/v1/2fb5193d923f4b71ad6a771e8700aa1f/submitSamples`:

The hex address in the URL above is your Site ID.
```
{
	"siteSecret": "zN2EY69fmy303MUEs7ZkQv8sqeuFjFEp",
	"samples": [
		{
			"ip": "89.238.154.238",
			"url": "http://example.com/wp-login.php"
		}
	]
}
```
