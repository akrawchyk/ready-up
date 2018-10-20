function lobbyRoutes (fastify, opts, next) {
  fastify.post('/lobbies',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            displayName: { type: 'string' }
          }
        },
        response: {
          201: {
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
      },
      beforeHandler: fastify.auth([
        fastify.verifyUserSession
      ])
    },
    async function createLobby (request, reply) {
      const { displayName } = request.body
      const createdByUserId = request.userSession.userId
      const newLobby = await fastify.readyUp.createLobby({ createdByUserId, displayName })
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
      const lobby = await fastify.readyUp.getLobby({ id: lobbyId })
      return lobby
    }
  )

  next()
}

module.exports = lobbyRoutes
