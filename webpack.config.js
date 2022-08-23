'use strict'

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'traaittPlatformRPC.js',
    library: 'traaittPlatformRPC',
    libraryTarget: 'umd'
  },
  node: {
    fs: 'empty',
    tls: 'empty',
    net: 'empty'
  },
  target: 'web'
}
