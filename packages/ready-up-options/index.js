const argv = require('yargs')
  .env('READY_UP')
  .option('HTTP_PORT', {
    alias: 'httpPort',
    default: 3000
  })
  .option('PG_CONNECTION_STRING', {
    alias: 'pgConnectionString',
    default: 'postgresql://postgres@localhost/ready-up'
  })
  .argv

module.exports = argv
