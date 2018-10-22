const { readFileSync } = require('fs')
const isDevelopment = process.env.NODE_ENV === 'development'
process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  // FIXME
  // configureWebpack: config => {
  //   if (isDevelopment) {
  //     config.entry.poll = 'webpack/hot/poll?1000'
  //   }
  // },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/firebase-messaging-sw.js'
    }
  },
  devServer: {
    allowedHosts: [
      'ready-up.test'
    ],
    historyApiFallback: true,
    host: '0.0.0.0',
    https: {
      key: readFileSync('./server.key'),
      cert: readFileSync('./server.crt')
    }
  }
}
