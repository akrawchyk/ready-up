function lobbyRoutes (fastify, opts, next) {
  fastify.post('/lobbies',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            displayName: { type: 'string' },
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
        const error = new fastify.InvalidParametersError('createdByUserId')
        reply.unprocessableEntity(error.message)
        return error
      }

      const newLobby = await fastify.ReadyUp.createLobby({ createdByUserId, displayName })
      reply.code(201)
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
