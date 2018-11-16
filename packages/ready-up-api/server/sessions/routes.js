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
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  displayName: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async function createSession(request, reply) {
      const { userDisplayName, userPassword } = request.body

      if (!userDisplayName || !userPassword) {
        let error
        if (!userDisplayName) error = new fastify.InvalidParametersError('userDisplayName')
        if (!userPassword) error = new fastify.InvalidParametersError('userPassword')
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
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    displayName: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        beforeHandler: fastify.auth([fastify.verifyCurrentSession])
      },
      async function getSession(request, reply) {
        return request.currentSession
      }
    )

  next()
}

module.exports = sessionRoutes
