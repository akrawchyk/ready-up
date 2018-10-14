async function userRoutes (fastify, opts, next) {
  fastify.post('/users',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            displayName: { type: 'string' }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'number' }
            }
          }
        }
      }
    },
    async function createUser (request, reply) {
      const { displayName } = request.body
      const newUser = await fastify.User.query()
        .insert({ displayName })
      return { id: newUser.id }
    }
  )

  fastify.get('/users/:userId',
    {
      schema: {
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
