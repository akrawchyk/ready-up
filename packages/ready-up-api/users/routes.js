function userRoutes (fastify, opts, next) {
  fastify.post('/users',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            displayName: {
              type: 'string',
              minLength: 1
            }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              displayName: { type: 'string' }
            }
          }
        }
      }
    },
    async function createUser (request, reply) {
      const { displayName } = request.body

      if (!displayName) {
        const error = new fastify.InvalidParametersError('displayName')
        reply.code(422)
        return error
      }

      const newUser = await fastify.ReadyUp.createUser({ displayName })
      reply.code(201)
      return newUser
    }
  )

  fastify.get('/users/:userId',
    {
      schema: {
        params: {
          userId: { type: 'number' }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              displayName: { type: 'string' }
            }
          }
        }
      }
    },
    async function getUser (request, reply) {
      const { userId } = request.params
      const user = await fastify.ReadyUp.getUser({ id: userId })
      return user
    }
  )

  next()
}

module.exports = userRoutes
