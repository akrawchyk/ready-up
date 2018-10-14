function friendRoutes (fastify, opts, next) {
  fastify.post('/friends',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            // TODO: add props
          }
        }
      }
    }
  )

  next()
}
