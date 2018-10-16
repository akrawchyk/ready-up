function lobbyMemberRoutes (fastify, opts, next) {
  fastify.post('/lobbyMembers',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            lobbyId: { type: 'number' },
            userId: { type: 'number' }
          }
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
      }
    },
    async function createLobbyMember (request, reply) {
      const { lobbyId, userId } = request.body

      if (!lobbyId || !userId) {
        reply.code(fastify.status.UNPROCESSABLE_ENTITY)
        if (!lobbyId) error = new fastify.MissingParameterError('lobbyId')
        if (!userId) error = new fastify.MissingParameterError('userId')
        return error
      }

      const newLobbyMember = await fastify.ReadyUp.createLobbyMember({ lobbyId, userId })
      reply.code(fastify.status.CREATED)
      return newLobbyMember
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
      const lobbyMember = await fastify.ReadyUp.getLobbyMember({ id: lobbyMemberId })
      return lobbyMember
    }
  )

  next()
}

module.exports = lobbyMemberRoutes
