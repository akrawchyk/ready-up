const Knex = require('knex')
const {
  BaseModel,
  User,
  Lobby,
  LobbyMember } = require('./models')

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
    return await Lobby.query()
      .insert({ createdByUserId, displayName })
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
  } catch(err) {
    throw(err)
  }

  BaseModel.knex(knex)

  const implementation = Object.keys(sdk)
    .reduce((impl, fnName) => {
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
