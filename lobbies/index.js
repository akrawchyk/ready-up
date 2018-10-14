function lobbiesService (fastify, opts, next) {
  fastify.register(require('./lobby'))
  fastify.register(require('./routes'))
  next()
}

module.exports = lobbiesService
