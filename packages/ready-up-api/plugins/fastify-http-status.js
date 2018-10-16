const fp = require('fastify-plugin')
const status = require('http-status')

async function fastifyHttpStatus (fastify, opts, next) {
  fastify.decorate('status', status)
  next()
}

module.exports = fp(fastifyHttpStatus)
