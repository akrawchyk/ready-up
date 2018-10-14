async function userRoutes (fastify, opts, next) {
  fastify.post('/users',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            displayName: { type: 'string' }
          },
          required: ['displayName'] // FIXME: required keys arent validated by fastify
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
        reply.code(fastify.status.UNPROCESSABLE_ENTITY)
        return new Error('Required parameter missing: displayName')
      }

      const newUser = await fastify.User.query()
        .insert({ displayName })
      reply.code(fastify.status.CREATED)
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
      const userId = request.params.userId
      const user = await fastify.User.query()
        .findOne('id', userId)
      return user
    }
  )
}

module.exports = userRoutes
