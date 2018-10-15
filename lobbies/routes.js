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

      if (!displayName) {
        // TODO assign random displayName
      }

      if (!createdByUserId) {
        reply.code(fastify.status.UNPROCESSABLE_ENTITY)
        return new Error('Required parameter missing: createdByUserId')
      }

      try {
        const newLobby = await fastify.Lobby.query()
          .insert({ createdByUserId, displayName })
        reply.code(fastify.status.CREATED)
        return newLobby
      } catch (err) {
        throw err
      }
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

      try {
        const lobby = await fastify.Lobby.query()
          .eager('lobbyMembers')
          .findById(lobbyId)
        return lobby
      } catch (err) {
        throw err
      }
    }
  )

  next()
}

module.exports = lobbyRoutes
