function usersService (fastify, opts, next) {
  fastify.register(require('./routes'))
  next()
}

module.exports = usersService
