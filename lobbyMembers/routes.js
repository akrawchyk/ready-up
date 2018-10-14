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

      const newLobbyMember = await fastify.LobbyMember.query()
        .insert({ lobbyId, userId })
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

      const lobbyMember = await fastify.LobbyMember.query()
        .findById(lobbyMemberId)

      if (!lobbyMember) {
        reply.code(fastify.status.NOT_FOUND)
        return new fastify.Model.NotFoundError()
      }

      return lobbyMember
    }
  )

  next()
}

module.exports = lobbyMemberRoutes
