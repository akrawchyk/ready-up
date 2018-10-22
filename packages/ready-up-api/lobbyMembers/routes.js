function lobbyMemberRoutes (fastify, opts, next) {
  fastify.post('/lobbyMembers',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            lobbyId: {
              type: 'number',
              minimum: 1
            },
            userId: {
              type: 'number',
              minimum: 1
            }
          }
          // required: ['lobbyId', 'userId']
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              lobbyId: { type: 'number' },
              userId: { type: 'number' },
              ready: { type: 'boolean' }
            }
          }
        }
      },
      beforeHandler: fastify.auth([
        fastify.verifyUserSession
      ])
    },
    async function createLobbyMember (request, reply) {
      const { lobbyId, userId } = request.body

      if (!lobbyId || !userId) {
        let error
        if (!lobbyId) error = new fastify.InvalidParametersError('lobbyId')
        if (!userId) error = new fastify.InvalidParametersError('userId')
        reply.code(400)
        return error
      }

      const createdByUserId = request.userSession.userId
      const newLobbyMember = await fastify.readyUp.createLobbyMember({
        lobbyId,
        userId,
        createdByUserId
      })
      reply.code(201)
      return newLobbyMember
    }
  )

  fastify.patch('/lobbyMembers/:lobbyMemberId',
    {
      schema: {
        params: {
          lobbyMemberId: { type: 'number' }
        },
        body: {
          ready: { type: 'boolean' }
        }
      }
    },
    async function updateLobbyMember (request, reply) {
      const { lobbyMemberId } = request.params
      const lobbyMember = await fastify.readyUp.updateLobbyMember({ id:
        lobbyMemberId,
        ready
      })
      reply.code(204)
      return
    }
  )

  fastify.get('/lobbyMembers/:lobbyMemberId',
    {
      schema: {
        params: {
          lobbyMemberId: { type: 'number' }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              lobbyId: { type: 'number' },
              userId: { type: 'number' },
              ready: { type: 'boolean' }
            }
          }
        }
      }
    },
    async function getLobbyMember (request, reply) {
      const { lobbyMemberId } = request.params
      const lobbyMember = await fastify.readyUp.getLobbyMember({ id: lobbyMemberId })
      return lobbyMember
    }
  )

  next()
}

module.exports = lobbyMemberRoutes
