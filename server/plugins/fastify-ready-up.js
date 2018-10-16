const fp = require('fastify-plugin')
const ReadyUp = require('../../ready-up')

function fastifyReadyUp (fastify, opts, next) {
  fastify.decorate('ReadyUp', ReadyUp)
  next()
}

module.exports = fp(fastifyReadyUp)
