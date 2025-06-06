# Split JavaScript Sync Tools

[![npm version](https://badge.fury.io/js/%40splitsoftware%2Fsplitio-sync-tools.svg)](https://badge.fury.io/js/%40splitsoftware%2Fsplitio-sync-tools) [![Build Status](https://github.com/splitio/javascript-sync-tools/actions/workflows/ci.yml/badge.svg)](https://github.com/splitio/javascript-sync-tools/actions/workflows/ci.yml)

## Overview
This package includes a set of JavaScript synchronization tools built based on the core implementation used by SDKs, allowing users to rely on this tool to synchronize the rollout plan data cache snapshot, as well as send the tracked events and impressions data to the Split cloud when running SDKs in consumer mode.

[![Twitter Follow](https://img.shields.io/twitter/follow/splitsoftware.svg?style=social&label=Follow&maxAge=1529000)](https://twitter.com/intent/follow?screen_name=splitsoftware)

## Compatibility
Split sync tools supports Node.js version 14 or higher. To run the tools in other JavaScript environments, the target environment must support ES6 (ECMAScript 2015) syntax, and provide built-in support or a global polyfill for Promises, Web Fetch API, Map and Set.

## Getting started
Below is a simple example that describes the execution of the JavaScript Synchronizer:

1. Install npm package via `npm install @splitsoftware/splitio-sync-tools`
2. Inside your app, import the `Synchronizer`

```javascript
const { Synchronizer } = require('@splitsoftware/splitio-sync-tools')
// or if your project supports EcmaScript modules
import { Synchronizer } from '@splitsoftware/splitio-sync-tools';
```

3. Instantiate the Synchronizer:

```javascript
const synchronizer = new Synchronizer({
  core: {
    authorizationKey: 'YOUR_SDK_KEY', // SDK key of type server side
  },
  // Mandatory: provide a valid storage instance.
  storage: {
    prefix: 'storagePrefix',
    wrapper: storageWrapper,
  },
});
```

4. Run the Synchronizer

```javascript
synchronizer.execute().then(() => console.log('ready'));
```

Please refer to [JavaScript Sync Tools](https://help.split.io/hc/en-us/articles/4421513571469-Split-JavaScript-synchronizer-tools) to learn about all the functionality provided by the package.

## Submitting issues
The Split team monitors all issues submitted to this [issue tracker](https://github.com/splitio/javascript-sync-tools/issues). We encourage you to use this issue tracker to submit any bug reports, feedback, and feature enhancements. We'll do our best to respond in a timely manner.

## Contributing
Please see [Contributors Guide](CONTRIBUTORS-GUIDE.md) to find all you need to submit a Pull Request (PR).

## License
Licensed under the Apache License, Version 2.0. See: [Apache License](http://www.apache.org/licenses/).

## About Split

Split is the leading Feature Delivery Platform for engineering teams that want to confidently deploy features as fast as they can develop them. Split’s fine-grained management, real-time monitoring, and data-driven experimentation ensure that new features will improve the customer experience without breaking or degrading performance. Companies like Twilio, Salesforce, GoDaddy and WePay trust Split to power their feature delivery.

To learn more about Split, contact hello@split.io, or get started with feature flags for free at https://www.split.io/signup.

Split has built and maintains SDKs for:

* .NET [Github](https://github.com/splitio/dotnet-client) [Docs](https://help.split.io/hc/en-us/articles/360020240172--NET-SDK)
* Android [Github](https://github.com/splitio/android-client) [Docs](https://help.split.io/hc/en-us/articles/360020343291-Android-SDK)
* Angular [Github](https://github.com/splitio/angular-sdk-plugin) [Docs](https://help.split.io/hc/en-us/articles/6495326064397-Angular-utilities)
* Elixir thin-client [Github](https://github.com/splitio/elixir-thin-client) [Docs](https://help.split.io/hc/en-us/articles/26988707417869-Elixir-Thin-Client-SDK)
* Flutter [Github](https://github.com/splitio/flutter-sdk-plugin) [Docs](https://help.split.io/hc/en-us/articles/8096158017165-Flutter-plugin)
* GO [Github](https://github.com/splitio/go-client) [Docs](https://help.split.io/hc/en-us/articles/360020093652-Go-SDK)
* iOS [Github](https://github.com/splitio/ios-client) [Docs](https://help.split.io/hc/en-us/articles/360020401491-iOS-SDK)
* Java [Github](https://github.com/splitio/java-client) [Docs](https://help.split.io/hc/en-us/articles/360020405151-Java-SDK)
* JavaScript [Github](https://github.com/splitio/javascript-client) [Docs](https://help.split.io/hc/en-us/articles/360020448791-JavaScript-SDK)
* JavaScript for Browser [Github](https://github.com/splitio/javascript-browser-client) [Docs](https://help.split.io/hc/en-us/articles/360058730852-Browser-SDK)
* Node.js [Github](https://github.com/splitio/javascript-client) [Docs](https://help.split.io/hc/en-us/articles/360020564931-Node-js-SDK)
* PHP [Github](https://github.com/splitio/php-client) [Docs](https://help.split.io/hc/en-us/articles/360020350372-PHP-SDK)
* PHP thin-client [Github](https://github.com/splitio/php-thin-client) [Docs](https://help.split.io/hc/en-us/articles/18305128673933-PHP-Thin-Client-SDK)
* Python [Github](https://github.com/splitio/python-client) [Docs](https://help.split.io/hc/en-us/articles/360020359652-Python-SDK)
* React [Github](https://github.com/splitio/react-client) [Docs](https://help.split.io/hc/en-us/articles/360038825091-React-SDK)
* React Native [Github](https://github.com/splitio/react-native-client) [Docs](https://help.split.io/hc/en-us/articles/4406066357901-React-Native-SDK)
* Redux [Github](https://github.com/splitio/redux-client) [Docs](https://help.split.io/hc/en-us/articles/360038851551-Redux-SDK)
* Ruby [Github](https://github.com/splitio/ruby-client) [Docs](https://help.split.io/hc/en-us/articles/360020673251-Ruby-SDK)

For a comprehensive list of open source projects visit our [Github page](https://github.com/splitio?utf8=%E2%9C%93&query=%20only%3Apublic%20).

**Learn more about Split:**

Visit [split.io/product](https://www.split.io/product) for an overview of Split, or visit our documentation at [help.split.io](https://help.split.io) for more detailed information.
