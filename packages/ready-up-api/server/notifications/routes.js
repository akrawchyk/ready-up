function notificationRoutes (fastify, opts, next) {
  fastify.post('/notifications',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            content : { type: 'string' },
            createdByUserId: {
              type: 'number',
              minimum: 1
            }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              createdByUserId: { type: 'number' },
              sent: { type: 'boolean' }
            }
          }
        }
      },
      beforeHandler: fastify.auth([
        fastify.verifyUserSession
      ])
    },
    async function createNotification (request, reply) {
      const { content } = request.body
      const createdByUserId = request.userSession.userId
      const newNotification = await fastify.readyUp.createNotification({ createdByUserId })
      reply.code(201)
      return newNotification
    }
  )

  fastify.get('/notifications/:notificationId',
    {
      schema: {
        params: {
          notificationId: { type: 'number' }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              sent: { type: 'boolean' }
            }
          }
        }
      }
    },
    async function getNotification (request, reply) {
      const { notificationId } = request.params
      const notification = await fastify.readyUp.getNotification({ id: notificationId })
      return notification
    }
  )

  next()
}

module.exports = notificationRoutes
