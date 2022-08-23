![image](https://github.com/TRRXITTE/traaittPlatform/blob/master/docs/etrx.png)

# traaittPlatform RPC

[![NPM](https://nodei.co/npm/@trrxitte/traaittplatform-rpc.png?downloads=true&stars=true)](https://nodei.co/npm/@trrxitte/traaittplatform-rpc/)

![Prerequisite](https://img.shields.io/badge/node-%3E%3D8-blue.svg) [![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://js-rpc.turtlecoin.dev) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/trrxitte/traaittplatform-rpc-js/graphs/commit-activity) [![License: GPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-yellow.svg)](https://github.com/trrxitte/traaittplatform-rpc-js/blob/master/LICENSE) [![Twitter: TRRXITTE](https://img.shields.io/twitter/follow/TRRXITTE.svg?style=social)](https://twitter.com/TRRXITTE)

#### Master Build Status
[![Build Status](https://travis-ci.org/turtlecoin/turtlecoin-rpc-js.png?branch=master)](https://travis-ci.org/turtlecoin/turtlecoin-rpc-js) [![Build Status](https://ci.appveyor.com/api/projects/status/github/brandonlehmann/turtlecoin-rpc?branch=master&svg=true)](https://ci.appveyor.com/project/brandonlehmann/turtlecoin-rpc/branch/master)

This project is designed to make it very easy to interact with various RPC APIs available within the [traaittPlatform](https://traaittplatform.com) Project. This entire project uses [Javascript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) to make things fast, easy, and safe.

## Package Upgrade Warning

v2.0.0+ contains multiple breaking changes to the package including the removal of support for Turtle-Service, removal of deprecated ETRXnetwork RPC calls that will be removed, renaming of methods, and method argument changes throughout. Please be sure to read the documentation in full before upgrading to v2.0.0+.

## Table of Contents

1. [Dependencies](#dependencies)
2. [Installation](#installation)
3. [Intialization](#intialization)
4. [traaittPlatform RPC API Interface](#etrxnetwork-rpc-api-interface)
5. [WalletAPI Interface](#walletapi-interface)

## Dependencies

* [NodeJS v8.x](https://nodejs.org) >= 8.x
* [traaittPlatform](https://github.com/turtlecoin/turtlecoin/releases) >= v1.4.4

## Installation

```bash
npm install traaittplatform-rpc
```

## Intialization

### ETRXnetwork
```javascript
const ETRXnetwork = require('traaittplatform-rpc').ETRXnetwork

const daemon = new ETRXnetwork({
  host: '127.0.0.1', // ip address or hostname of the ETRXnetwork host
  port: 14486, // what port is the RPC server running on
  timeout: 2000, // request timeout
  ssl: false, // whether we need to connect using SSL/TLS
  userAgent: 'traaittplatform-rpc/2.0.0' // specify a customer user-agent or use the default
})
```

### Wallet-API
```javascript
const WalletAPI = require('traaittplatform-rpc').WalletAPI

const wallet = new WalletAPI({
  host: '127.0.0.1', // ip address or hostname of wallet-api host
  port: 8447, // port wallet-api is running on, default is 8447
  timeout: 5000, // how long to wait before timing out the connection
  ssl: false, // whether or not to connect through SSL
  password: 'password', // your rpc password
  defaultMixin: 3, // should be configured to the default mixin, or false if no default mixin is set
  defaultFee: 0.0000001, // the default fee of your network, in decimal not atomic units
  decimalDivisor: 100000000, // how many decimals will be used
  defaultUnlockTime: 0, // default unlock time
  userAgent: 'traaittplatform-rpc/2.0.0' // specify a customer user-agent or use the default
})
```

### Documentation

You can find the full documentation for this library [here](https://documentation.trrxitte.com/developer/api/Daemon-JSON-RPC-API)

## License

```
Copyright (C) 2022 - TODAY, TRRXITTE Int., incorporate
Copyright (C) 2018-2019 Brandon Lehmann, The TurtleCoin Developers

Please see the included LICENSE file for more information.
```
