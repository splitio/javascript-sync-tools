# Split NodeJS Synchronizer
[![Build Status](https://api.travis-ci.com/splitio/javascript-slim-synchronizer.svg?branch=main)](https://api.travis-ci.com/splitio/javascript-slim-synchronizer)

## Overview
Thin version of Split Synchronizer supporting the core of the synchronization mechanisms used by Split SDK producer libraries.

[![Twitter Follow](https://img.shields.io/twitter/follow/splitsoftware.svg?style=social&label=Follow&maxAge=1529000)](https://twitter.com/intent/follow?screen_name=splitsoftware)

## Compatibility
Split Synchronizer supports Node version 14 or higher.

## Getting started
Below is a simple example that describes the execution or instantiation of Split NodeJS Synchronizer:

### Install package as global dependency and run CLI
1. Install npm package via `npm install -g @splitsoftware/splitio-node-slim-synchronizer`
2. Then, execute the CLI `split-node-synchronizer [...args]`

### Install package as a dependency in your project
1. Install npm package via `npm install @splitsoftware/splitio-node-slim-synchronizer`
2. Inside your app, import the `Synchronizer`
```
const { Synchronizer } = require('@splitsoftware/splitio-node-slim-synchronizer')
// or if your project supports modules and ESM
import { Synchronizer } from '@splitsoftware/splitio-node-slim-synchronizer';
```

3. Set the configurations:
```
// Example:
const settings = {
  core: {
    authorizationKey: '<A_VALID_STAGING_APIKEY>',
  },
  urls: {
    sdk: 'https://sdk.split.io/api',       // already a default value
    events: 'https://events.split.io/api', // already a default value
  },
  // Mandatory: provide a valid Storage wrapper.
  storage: {
    type: 'CUSTOM',
    prefix: 'storagePrefix',
    wrapper: customStorage,
  },
  synchronizerConfigs: {

  },
};
const _sync = new Synchronizer(settings);
```

4. Run the Synchronizer
```
_sync.execute().then(() => console.log('ready'));
```

Please refer to [our official docs (@TODO)](https://help.split.io/hc/en-us/articles/360020037072-Split-Evaluator) to learn about all the functionality provided by Split NodeJS Synchronizer and the configuration options available.

## Submitting issues
The Split team monitors all issues submitted to this [issue tracker](https://github.com/splitio/javascript-slim-synchronizer/issues). We encourage you to use this issue tracker to submit any bug reports, feedback, and feature enhancements. We'll do our best to respond in a timely manner.

## Contributing
Please see [Contributors Guide](CONTRIBUTORS-GUIDE.md) to find all you need to submit a Pull Request (PR).

## License
Licensed under the Apache License, Version 2.0. See: [Apache License](http://www.apache.org/licenses/).

## About Split

Split is the leading Feature Delivery Platform for engineering teams that want to confidently deploy features as fast as they can develop them. Split’s fine-grained management, real-time monitoring, and data-driven experimentation ensure that new features will improve the customer experience without breaking or degrading performance. Companies like Twilio, Salesforce, GoDaddy and WePay trust Split to power their feature delivery.

To learn more about Split, contact hello@split.io, or get started with feature flags for free at https://www.split.io/signup.

Split has built and maintains SDKs for:

* Java [Github](https://github.com/splitio/java-client) [Docs](https://help.split.io/hc/en-us/articles/360020405151-Java-SDK)
* Javascript [Github](https://github.com/splitio/javascript-client) [Docs](https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK)
* Node [Github](https://github.com/splitio/javascript-client) [Docs](https://help.split.io/hc/en-us/articles/360020564931-Node-js-SDK)
* .NET [Github](https://github.com/splitio/.net-core-client) [Docs](https://help.split.io/hc/en-us/articles/360020240172--NET-SDK)
* Ruby [Github](https://github.com/splitio/ruby-client) [Docs](https://help.split.io/hc/en-us/articles/360020673251-Ruby-SDK)
* PHP [Github](https://github.com/splitio/php-client) [Docs](https://help.split.io/hc/en-us/articles/360020350372-PHP-SDK)
* Python [Github](https://github.com/splitio/python-client) [Docs](https://help.split.io/hc/en-us/articles/360020359652-Python-SDK)
* GO [Github](https://github.com/splitio/go-client) [Docs](https://help.split.io/hc/en-us/articles/360020093652-Go-SDK)
* Android [Github](https://github.com/splitio/android-client) [Docs](https://help.split.io/hc/en-us/articles/360020343291-Android-SDK)
* IOS [Github](https://github.com/splitio/ios-client) [Docs](https://help.split.io/hc/en-us/articles/360020401491-iOS-SDK)

For a comprehensive list of opensource projects visit our [Github page](https://github.com/splitio?utf8=%E2%9C%93&query=%20only%3Apublic%20).

**Learn more about Split:**

Visit [split.io/product](https://www.split.io/product) for an overview of Split, or visit our documentation at [docs.split.io](https://help.split.io/hc/en-us) for more detailed information.
