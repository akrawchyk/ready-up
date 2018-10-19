function sessionRoutes (fastify, opts, next) {
  fastify.post('/sessions',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            userDisplayName: {
              type: 'string',
              minLength: 1
            },
            userPassword: {
              type: 'string',
              minLength: 8
            }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              userId: { type: 'number' },
              userDisplayName: { type: 'string' }
            }
          }
        }
      }
    },
    async function createSession (request, reply) {
      const { userDisplayName, userPassword } = request.body

      if (!userDisplayName) {
        const error = new fastify.InvalidParametersError('userDisplayName')
        reply.code(400)
        return error
      }

      const newSession = await fastify.ReadyUp.createSession({ userDisplayName, userPassword })
      request.session.set('sessionId', newSession.id)
      reply.code(201)
      return newSession
    }
  )

  next()
}

module.exports = sessionRoutes
