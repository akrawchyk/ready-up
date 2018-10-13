async function userRoutes (fastify, options) {
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
      const displayName = request.body.displayName
      // create user with displayName, return id
      return { id: 4 }
    }
  )

  fastify.get('/users/:userId',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              displayName: { type: 'string' }
            }
          }
        }
      }
    },
    async function getUser (request, reply) {
      const userId = request.params.userId
      return { displayName: userId }
    }
  )
}

module.exports = userRoutes
