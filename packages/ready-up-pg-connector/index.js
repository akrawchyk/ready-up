const Knex = require('knex')
const { transaction } = require('objection')
const {
  BaseModel,
  User,
  Lobby,
  LobbyMember,
  Notification } = require('./models')

const pgInterface = {
  BaseModel,

  async createUser ({ displayName }) {
    return await User.query()
      .insert({ displayName })
  },

  async getUser ({ id }) {
    return await User.query()
      .findById(id)
      .throwIfNotFound()
  },

  async createLobby ({ createdByUserId, displayName }) {
    const knex = Notification.knex()
    let trx

    try {
      trx = await transaction.start(knex)

      // FIXME query friends
      // FIXME query allowed permission
      const invitees = await User.query()
        .whereNot({ id: createdByUserId })
        .limit(4)
        .pluck('id')
        .then(userIds => userIds.map(id => {
          return {
            userId: id,
            lobbyId: "#ref{newLobby.id}"
          }
        }))

      const newLobby = await Lobby.query()
        .insertGraphAndFetch([{
          '#id': 'newLobby',
          createdByUserId,
          displayName,
          lobbyMembers: invitees
        }])
        .then(graph => graph[0])

      await Notification.query()
        .insert(newLobby.lobbyMembers
          .filter(lobbyMember => lobbyMember.id !== createdByUserId)
          .map(lobbyMember => {
            return {
              recipientUserId: lobbyMember.userId,
              createdByUserId
            }
          })
        )

      // TODO send notification

      await trx.commit()
      return newLobby
    } catch (err) {
      await trx.rollback()
      throw err
    }
  },

  async getLobby ({ id }) {
    return await Lobby.query()
      .eager('lobbyMembers')
      .findById(id)
      .throwIfNotFound()
  },

  async createLobbyMember ({ lobbyId, userId }) {
    return await LobbyMember.query()
      .insert({ lobbyId, userId })
  },

  async getLobbyMember ({ id }) {
    return await LobbyMember.query()
      .findById(id)
      .throwIfNotFound()
  },

  async createNotification ({ createdByUserId }) {
    return await Notification.query()
      .insert({ createdByUserId })
      .returning(['id', 'sent', 'createdByUserId'])
  },

  async getNotification ({ id }) {
    return await Notification.query()
      .findById(id)
      .throwIfNotFound()
  }
}

function readyUpPgConnector(sdk, opts) {
  const { pgConnectionString } = opts
  let knex

  try {
    const isDevelopment = process.env.NODE_ENV !== 'production'
    knex = Knex({
      client: 'pg',
      useNullAsDefault: true,
      asyncStackTraces: isDevelopment,
      connection: pgConnectionString
    })
  } catch (err) {
    throw err
  }

  BaseModel.knex(knex)

  const implementation = Object.keys(sdk)
    .reduce((impl, fnName) => {
      if (typeof pgInterface[fnName] !== 'function') {
        return Object.assign(impl, {
          [fnName]: sdk[fnName]
        })
      }
      return Object.assign(impl, {
        [fnName]: new Proxy(sdk[fnName], {
          apply: async function(target, thisArg, argumentsList) {
            return await pgInterface[fnName](...argumentsList)
          }
        })
      })
    }, {})

  Object.assign(implementation, { BaseModel })

  return implementation
}

module.exports = readyUpPgConnector