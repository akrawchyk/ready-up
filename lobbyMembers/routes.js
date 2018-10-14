const { ValidationError, NotFoundError } = require('objection')

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
        if (!lobbyId) error = new Error('Required parameter missing: lobbyId')
        if (!userId) error = new Error('Required parameter missing: userId')
        return error
      }

      try {
        const newLobbyMember = await fastify.LobbyMember.query()
          .insert({ lobbyId, userId })
        return newLobbyMember
      } catch(err) {
        if (err instanceof ValidationError) {
          reply.code(fastify.status.UNPROCESSABLE_ENTITY)
          return new Error(err.message)
        }

        throw err
      }
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

      try {
        const lobbyMember = await fastify.LobbyMember.query()
          .findOne('id', lobbyMemberId)
        return lobbyMember
      } catch (err) {
        throw err
      }
    }
  )

  next()
}

module.exports = lobbyMemberRoutes
