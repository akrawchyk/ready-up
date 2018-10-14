module.exports = function usersService (fastify, opts, next) {
  fastify.register(require('./user'))
  fastify.register(require('./routes'))
  next()
}
