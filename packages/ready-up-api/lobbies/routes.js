function lobbyRoutes (fastify, opts, next) {
  fastify.post('/lobbies',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            displayName: { type: 'string' },
            createdByUserId: { type: 'number' }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              displayName: { type: 'string' },
              createdByUserId: { type: 'number' }
            }
          }
        }
      }
    },
    async function createLobby (request, reply) {
      const { displayName, createdByUserId } = request.body

      if (!createdByUserId) {
        reply.code(fastify.status.UNPROCESSABLE_ENTITY)
        return new Error('Required parameter missing: createdByUserId')
      }

      newLobby = await fastify.ReadyUp.createLobby({ createdByUserId, displayName })
      reply.code(fastify.status.CREATED)
      return newLobby
    }
  )

  fastify.get('/lobbies/:lobbyId',
    {
      schema: {
        params: {
          lobbyId: { type: 'number' }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              displayName: { type: 'string' },
              lobbyMembers: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                  }
                }
              }
            }
          }
        }
      }
    },
    async function getLobby (request, reply) {
      const { lobbyId } = request.params
      const lobby = await fastify.ReadyUp.getLobby({ id: lobbyId })
      return lobby
    }
  )

  next()
}

module.exports = lobbyRoutes
