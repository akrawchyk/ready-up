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
      }
    },
    async function createNotification (request, reply) {
      const { createdByUserId, content } = request.body

      if (!createdByUserId) {
        const error = new fastify.InvalidParametersError('createdByUserId')
        reply.unprocessableEntity(error.message)
        return error
      }

      const newNotification = await fastify.ReadyUp.createNotification({ createdByUserId })
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
      const notification = await fastify.ReadyUp.getNotification({ id: notificationId })
      return notification
    }
  )

  next()
}

module.exports = notificationRoutes