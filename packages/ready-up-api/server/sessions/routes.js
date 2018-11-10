function sessionRoutes(fastify, opts, next) {
  fastify.post(
    '/sessions',
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
              minLength: 10
            }
          }
          // required: ['userDisplayName', 'userPassword']
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
    async function createSession(request, reply) {
      const { userDisplayName, userPassword } = request.body

      if (!userDisplayName || !userPassword) {
        let error
        if (!userDisplayName)
          error = new fastify.InvalidParametersError('userDisplayName')
        if (!userPassword)
          error = new fastify.InvalidParametersError('userPassword')
        reply.code(400)
        return error
      }

      const newSession = await fastify.readyUp.createSession({
        userDisplayName,
        userPassword
      })
      request.session.set('sessionId', newSession.id)
      reply.code(201)
      return newSession
    }
  ),
    fastify.get(
      '/sessions',
      {
        schema: {
          response: {
            200: {
              type: 'object',
              properties: {
                userId: { type: 'string' },
                userDisplayName: { type: 'string' }
              }
            }
          }
        },
        beforeHandler: fastify.auth([fastify.verifyUserSession])
      },
      async function getSession(request, reply) {
        return request.userSession
      }
    )

  next()
}

module.exports = sessionRoutes
