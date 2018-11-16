const Knex = require('knex')
const { transaction } = require('objection')
const argon2 = require('@phc/argon2')
const { NotAuthorizedError } = require('ready-up-sdk')
const { BaseModel, User, Lobby, LobbyMember, Notification, Session } = require('./models')

const pgInterface = {
  async createSession({ userDisplayName, userPassword }) {
    const user = await User.query()
      .findOne({ displayName: userDisplayName })
      .throwIfNotFound()

    const match = await argon2.verify(user.hashedPassword, userPassword)
    if (!match) throw new NotAuthorizedError()

    // TODO find fresh cached session if exists

    const session = await Session.query().insert({ userId: user.id })

    return {
      id: session.id,
      user: {
        // FIXME how to filter for visibleFields
        id: user.id,
        displayName: user.displayName
      }
    }
  },

  getSession({ id }) {
    const currentTime = new Date()
    const cutoffTime = new Date(currentTime - process.env.READY_UP_MAX_SESSION_MS).toISOString()

    return Session.query()
      .eager('user')
      .findOne({ id })
      .andWhere('createdAt', '>', cutoffTime)
      .throwIfNotFound()
      .then((session) => {
        return {
          user: {
            id: session.user.id,
            displayName: session.user.displayName
          }
        }
      })
  },

  async createUser({ displayName, password }) {
    const hashedPassword = await argon2.hash(password)

    return User.query()
      .returning(User.visibleFields)
      .insert({ displayName, hashedPassword })
  },

  updateUser({ id, firebaseMessagingToken }) {
    return User.query()
      .where({ id })
      .patch({ firebaseMessagingToken })
      .returning(User.visibleFields)
      .throwIfNotFound()
  },

  getUser({ id }) {
    return User.query()
      .returning(User.visibleFields)
      .findById(id)
      .throwIfNotFound()
  },

  async createLobby({ createdByUserId, displayName }) {
    const knex = Notification.knex()
    let trx

    try {
      trx = await transaction.start(knex)

      // TODO should we move this to the client? create multiple lobbyMembers there?
      // e.g. Promise.all([createLobbyMember(), createLobbyMember()])
      const invitees = await User.query()
        // FIXME query friends
        // FIXME query user allowed permission
        .whereNotNull('firebaseMessagingToken')
        .limit(4)
        // .whereIn('id', [1, 2, 3])
        .pluck('id')
        .then((userIds) =>
          userIds.map((id) => {
            return {
              userId: id,
              lobbyId: '#ref{newLobby.id}',
              createdByUserId
            }
          })
        )

      console.log(invitees)

      const newLobby = await Lobby.query()
        .insertGraphAndFetch([
          {
            '#id': 'newLobby',
            createdByUserId,
            displayName,
            lobbyMembers: invitees
          }
        ])
        .then((graph) => graph[0])

      await trx.commit()

      return newLobby
    } catch (err) {
      await trx.rollback()
      throw err
    }
  },

  getLobby({ id }) {
    return Lobby.query()
      .eager(['lobbyMembers', 'lobbyMembers.user'])
      .findById(id)
      .throwIfNotFound()
  },

  queryLobbies({ createdByUserId }) {
    return Lobby.query()
      .where('createdByUserId', createdByUserId)
      .eager('lobbyMembers')
      .mergeEager('lobbyMembers.user')
      .orderBy('createdAt', 'DESC')
  },

  createLobbyMember({ lobbyId, userId }) {
    return LobbyMember.query().insert({ lobbyId, userId })
  },

  updateLobbyMember({ id, ready }) {
    return LobbyMember.query()
      .where({ id })
      .patch({ ready })
      .throwIfNotFound()
  },

  getLobbyMember({ id }) {
    return LobbyMember.query()
      .findById(id)
      .throwIfNotFound()
  },

  createNotification({ createdByUserId, recipientUserId }) {
    return Notification.query()
      .eager('recipient')
      .insert({
        createdByUserId,
        recipientUserId
      })
  },

  batchCreateNotifications(recipients = []) {
    if (recipients.length === 0) {
      return
    }

    return Notification.query()
      .eager('recipient')
      .insert(
        recipients.map(({ recipientUserId, createdByUserId }) => {
          return {
            recipientUserId,
            createdByUserId
          }
        })
      )
  },

  getNotification({ id }) {
    return Notification.query()
      .eager('recipient')
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

  return Object.keys(sdk).reduce((impl, fnName) => {
    return Object.assign(impl, {
      [fnName]: new Proxy(sdk[fnName], {
        apply: function(target, thisArg, argumentsList) {
          if (typeof pgInterface[fnName] !== 'function') {
            return Reflect.apply(target, thisArg, argumentsList)
          }
          return pgInterface[fnName](...argumentsList)
        }
      })
    })
  }, {})
}

module.exports = readyUpPgConnector
