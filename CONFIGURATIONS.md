# Configuration parameters

| PARAMETER | ALIAS 	   	          | ENV/JSON              | REQUIRED	| DESCRIPTION 					                                                                              | OPTIONS / EXAMPLE 		                                  |
| --------- | --------------------- |---------------------- | --------- | -----------					                                                                                |	---------------                               |
| -c        | --customRun  	        | CUSTOM_RUN            | NO		    | Set a custom execution to run. 		                                                                  | `splitsAndSegments` or `eventsAndImpressions` |
| -s        | --storage  	          | STORAGE_PATH          | YES		    | Path to the JS file exposing the Storage API. 	                                                    | `path/to/storageAdapter.js`                   |
| -d        | --debug  	            | DEBUG                 | NO		    | Set Logger in DEBUG mode enable. 	                                                                  | N/A                                           |
| -k        | --apikey  	          | APIKEY                | YES		    | Set the Split apikey. 	                                                                            | N/A		                                        |
| -r        | --apiUrl  	          | API_URL               | NO		    | Set the Split API URL. 	                                                                            | N/A		                                        |
| -e        | --eventsApiUrl 	      | EVENTS_API_URL        | NO	    	| Set a custom execution to run. 	                                                                    | N/A	                                          |
| -m        | --mode  	            |                       | NO		    | Set where to obtain the Synchronizer configurations. If empty, it implies set via CLI arguments.   	| `json` or `env`                               |
| -p        | --prefix  	          | PREFIX                | NO	    	| Set the Storage's prefix 	                                                                          | N/A		                                        |
| -n        | --eventsPerPost       | EVENTS_PER_POST       | NO    		| Set the number of events to send in a POST request 	                                                | N/A		                                        |
| -f        | --impressionsPerPost  | IMPRESSIONS_PER_POST  | NO    		| Set a custom execution to run 	                                                                    | N/A		                                        |
| -t        | --maxRetries          | MAX_RETRIES           | NO    		| Set the number of retries attempt perform an Event or Impression POST request.	                    | N/A		                                        |
| -i        | --impressionsMode     | IMPRESSIONS_MODE      | NO    		| This configuration defines how impressions are queued.                                              | `optimized` or `debug`                        |

## CLI usage example
```
splitio-node-synchronizer
  --apikey <A_VALID_APIKEY>
  --storage /path/to/storageAdapter.js
  --apiUrl https://sdk.split.io/api
  --eventsApiUrl https://events.split.io/api
  --prefix myStoragePrefix
  --eventsPerPost 2000
  --impressionsPerPost 3000
  --impressionsMode debug
  --maxRetries 5
  --debug
```
## `env` mode usage example

```
splitio-node-synchronizer
  --mode env
  API_KEY=<A_VALID_APIKEY>
  STORAGE_PATH=/path/to/storageAdapter.js
  API_URL=https://sdk.split.io/api
  EVENTS_API_URL=https://events.split.io/api
  PREFIX=myStoragePrefix
  EVENTS_PER_POST=2000
  IMPRESSIONS_PER_POST=3000
  IMPRESSIONS_MODE=debug
  MAX_RETRIES=5
  DEBUG=true
```

## `json` mode usage example

```
splitio-node-synchronizer --mode json --config /path/to/config.json
```

JSON file example:
```
{
  "API_KEY": "<A_VALID_APIKEY>",
  "STORAGE_PATH": "/path/to/storageAdapter.js",
  "API_URL": "https://sdk.split.io/api",
  "EVENTS_API_URL": "https://events.split.io/api",
  "PREFIX": "myStoragePrefix",
  "EVENTS_PER_POST": 2000,
  "IMPRESSIONS_PER_POST": 3000,
  "IMPRESSIONS_MODE": "debug",
  "MAX_RETRIES": 5,
  "DEBUG": "true"
}
```
