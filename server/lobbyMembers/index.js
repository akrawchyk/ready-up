function lobbyMembersService (fastify, opts, next) {
  fastify.register(require('./routes'))
  next()
}

module.exports = lobbyMembersService
