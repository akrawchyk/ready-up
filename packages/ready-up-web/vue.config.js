const { readFileSync } = require('fs')
const isDevelopment = process.env.NODE_ENV === 'development'
process.env.VUE_APP_VERSION = require('./package.json').version

const config = {
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      importWorkboxFrom: 'local',
      swSrc: 'src/firebase-messaging-sw.js'
    }
  }
}

if (isDevelopment) {
  config.devServer = {
    allowedHosts: ['ready-up.test'],
    historyApiFallback: true,
    host: '0.0.0.0',
    https: {
      // key: readFileSync(process.env.READY_UP_SSL_CERT_PATH),
      // cert: readFileSync(process.env.READY_UP_SSL_KEY_PATH)
      key: readFileSync('/home/andrew/tmp/ssl/ready-up.test.key'),
      cert: readFileSync('/home/andrew/tmp/ssl/ready-up.test.crt')
    },
    public: 'ready-up.test:8080'
  }
}

module.exports = config
