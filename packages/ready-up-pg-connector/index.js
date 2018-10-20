const Knex = require('knex')
const { transaction } = require('objection')
const argon2 = require('@phc/argon2')
const admin = require('firebase-admin')
const { NotAuthorizedError } = require('ready-up-sdk')
const {
  BaseModel,
  User,
  Lobby,
  LobbyMember,
  Notification,
  Session } = require('./models')
const serviceAccount = require('./ready-up-f1555-firebase-adminsdk-wxb67-632d601424.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  messagingSenderId: '751484056905'
})

const pgInterface = {
  BaseModel,

  async createSession ({ userDisplayName, userPassword }) {
    const user = await User.query()
      .findOne({ displayName: userDisplayName })
      .throwIfNotFound()

    const match = await argon2.verify(user.hashedPassword, userPassword)
    if (!match) throw new NotAuthorizedError()

    // TODO find fresh cached session if exists

    const session = await Session.query()
      .insert({ userId: user.id })

    return {
      id: session.id,
      userId: user.id,
      userDisplayName: user.displayName
    }
  },

  async getSession ({ id }) {
    const currentTime = new Date()
    const maxSessionTime = 1000 * 60 * 20 // 20 minutes
    const cutoffTime = new Date(currentTime - maxSessionTime).toISOString()

    return await Session.query()
      .eager('user')
      .findOne({ id })
      .andWhere('createdAt', '>', cutoffTime)
      .throwIfNotFound()
      .then(session => {
        return {
          userId: session.user.id,
          userDisplayName: session.user.displayName
        }
      })
  },

  async createUser ({ displayName, password }) {
    const hashedPassword = await argon2.hash(password)

    return await User.query()
      .returning(User.visibleFields)
      .insert({ displayName, hashedPassword })
  },

  async getUser ({ id }) {
    return await User.query()
      .returning(User.visibleFields)
      .findById(id)
      .throwIfNotFound()
  },

  async createLobby ({ createdByUserId, displayName }) {
    const knex = Notification.knex()
    let trx

    try {
      trx = await transaction.start(knex)

      const invitees = await User.query()
        .whereNot({ id: createdByUserId })
        // FIXME query friends
        // FIXME query user allowed permission
        .limit(4)
        .pluck('id')
        .then(userIds => userIds.map(id => {
          return {
            userId: id,
            lobbyId: "#ref{newLobby.id}",
            createdByUserId
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

      const recipients = newLobby.lobbyMembers
        .filter(lobbyMember => lobbyMember.id !== createdByUserId)

      const notifications = await Notification.query()
        .insert(recipients.map(lobbyMember => {
          return {
            recipientUserId: lobbyMember.userId,
            createdByUserId
          }
        }))

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
