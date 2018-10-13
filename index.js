const argv = require('yargs')
  .env('READY_UP')
  .option('HTTP_PORT', {
    alias: 'port',
    default: 3000
  })
  .argv
const listen = require('./server')

listen({ httpPort: argv.port })
