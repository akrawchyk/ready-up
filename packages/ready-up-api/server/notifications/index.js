function notificationsService(fastify, opts, next) {
  fastify.register(require('./routes'))
  next()
}

module.exports = notificationsService
