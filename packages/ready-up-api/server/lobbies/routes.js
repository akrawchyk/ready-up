function lobbyRoutes(fastify, opts, next) {
  fastify.post(
    '/lobbies',
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
                    id: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      },
      beforeHandler: fastify.auth([fastify.verifyCurrentSession])
    },
    async function createLobby(request, reply) {
      const { displayName } = request.body
      const createdByUserId = request.currentSession.user.id
      const newLobby = await fastify.readyUp.createLobby({
        createdByUserId,
        displayName
      })

      const recipients = newLobby.lobbyMembers
        .filter((lobbyMember) => lobbyMember.userId !== createdByUserId)
        .map(lobbyMember => {
          return {
            recipientUserId: lobbyMember.userId,
            createdByUserId
          }
        })

      const title = newLobby.displayName || `New Lobby ${newLobby.id}`
      const body = `Ready-up with ${newLobby.lobbyMembers.length} others!`
      const data = { lobby: JSON.stringify(newLobby) }
      let notifications = await fastify.readyUp.batchCreateNotifications(recipients)
      notifications = notifications.filter(notification => notification.recipient.firebaseMessagingToken)
        .map(notification => {
          return {
            data,
            title,
            body,
            token: notification.recipient.firebaseMessagingToken
          }
        })

      // FIXME add Device model, this only sends notifications to the last-used device
      await fastify.notifier.send(notifications)

      reply.code(201)
      return newLobby
    }
  )

  fastify.get(
    '/lobbies',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              lobbies: {
                type: 'array',
                items: {
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
                          ready: { type: 'boolean' },
                          user: {
                            type: 'object',
                            properties: {
                              id: { type: 'number' },
                              displayName: { type: 'string' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      beforeHandler: fastify.auth([fastify.verifyCurrentSession])
    },
    async function queryLobbies(request, reply) {
      const createdByUserId = request.currentSession.user.id
      const lobbies = await fastify.readyUp.queryLobbies({
        createdByUserId
      })
      return { lobbies }
    }
  )

  fastify.get(
    '/lobbies/:lobbyId',
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
                    id: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async function getLobby(request, reply) {
      const { lobbyId } = request.params
      const lobby = await fastify.readyUp.getLobby({ id: lobbyId })
      return lobby
    }
  )

  next()
}

module.exports = lobbyRoutes
