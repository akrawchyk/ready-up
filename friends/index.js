function friendsService (fastify, opts, next) {
  fastify.register(require('./friend'))
  fastify.register(require('./routes'))
  next()
}


