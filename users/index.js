function usersService (fastify, opts, next) {
  fastify.register(require('./plugin'))
  fastify.register(require('./routes'))
  next()
}

module.exports = usersService
