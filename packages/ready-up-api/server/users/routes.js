function userRoutes(fastify, opts, next) {
  fastify.post(
    '/users',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            displayName: {
              type: 'string',
              minLength: 1
            },
            password: {
              type: 'string',
              minLength: 10
            }
          }
          // required: ['displayName', 'password']
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
    async function createUser(request, reply) {
      const { displayName, password } = request.body

      if (!displayName || !password) {
        let error
        if (!displayName)
          error = new fastify.InvalidParametersError('displayName')
        if (!password) error = new fastify.InvalidParametersError('password')
        reply.code(400)
        return error
      }

      const newUser = await fastify.readyUp.createUser({
        displayName,
        password
      })
      reply.code(201)
      return newUser
    }
  )

  fastify.patch(
    '/users/:userId',
    {
      schema: {
        params: {
          userId: { type: 'number' }
        },
        body: {
          firebaseMessagingToken: { type: 'string' }
        }
      },
      beforeHandler: fastify.auth([fastify.verifyUserSession])
    },
    async function updateUser(request, reply) {
      let { firebaseMessagingToken } = request.body

      if (!firebaseMessagingToken) {
        firebaseMessagingToken = ''
      }

      const userId = request.userSession.userId
      await fastify.readyUp.updateUser({ id: userId, firebaseMessagingToken })
      reply.code(204)
      return
    }
  )

  fastify.get(
    '/users/:userId',
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
    async function getUser(request, reply) {
      const { userId } = request.params
      const user = await fastify.readyUp.getUser({ id: userId })
      return user
    }
  )

  next()
}

module.exports = userRoutes
