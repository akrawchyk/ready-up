const Knex = require('knex')
const { transaction } = require('objection')
const argon2 = require('@phc/argon2')
const admin = require('firebase-admin')
const { NotAuthorizedError } = require('ready-up-sdk')
const { BaseModel, User, Lobby, LobbyMember, Notification, Session } = require('./models')

const serviceAccount = require(process.env.READY_UP_FIREBASE_SERVICE_ACCOUNT_KEY_PATH)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  messagingSenderId: process.env.READY_UP_FIREBASE_MESSAGING_SENDER_ID
})

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
      userId: user.id,
      userDisplayName: user.displayName
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
          userId: session.user.id,
          userDisplayName: session.user.displayName
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
    let newLobby
    let notifications

    try {
      trx = await transaction.start(knex)

      const invitees = await User.query()
        // FIXME query friends
        // FIXME query user allowed permission
        .limit(4)
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

      newLobby = await Lobby.query()
        .insertGraphAndFetch([
          {
            '#id': 'newLobby',
            createdByUserId,
            displayName,
            lobbyMembers: invitees
          }
        ])
        .then((graph) => graph[0])

      const recipients = newLobby.lobbyMembers.filter(
        (lobbyMember) => lobbyMember.userId !== createdByUserId
      )

      notifications = await Notification.query()
        .eager('recipient')
        .insert(
          recipients.map((lobbyMember) => {
            return {
              recipientUserId: lobbyMember.userId,
              createdByUserId
            }
          })
        )

      await trx.commit()
    } catch (err) {
      await trx.rollback()
      throw err
    }

    // FIXME move to background job that looks for notification records that are not "sent"
    // FIXME make a separate notification module
    const outbox = notifications.map((notification) => {
      // FIXME skip if no recipient token?
      return async function sendNotification() {
        if (!notification.recipient.firebaseMessagingToken) {
          // dont send to users that aren't accepting notifications
          return Promise.resolve()
        }

        const title = newLobby.displayName || `New Lobby ${newLobby.id}`
        const body = `Ready up with ${newLobby.lobbyMembers.length} others!`
        const message = {
          // TODO lobby presenter for notifications (max 4KB)
          data: { lobby: JSON.stringify(newLobby) },
          // https://firebase.google.com/docs/cloud-messaging/admin/send-messages#defining_the_message
          webpush: {
            notification: {
              title,
              body,
              // icon: 'https://ready-up.test:8000/img/icons/android-chrome-192x192.png'
              icon: 'https://ready-up.test:8080/img/icons/android-chrome-192x192.png'
            }
          },
          // FIXME add Device model, this only sends notifications to the last-used device
          token: notification.recipient.firebaseMessagingToken
        }

        try {
          const response = await admin.messaging().send(message)
          console.info('Successfully sent message: ', response)
          return notification.$query().patch({ sent: true })
        } catch (err) {
          console.error('Error sending message:', err)
        }
      }
    })

    await Promise.all(outbox.map((send) => send()))

    return newLobby
  },

  getLobby({ id }) {
    return Lobby.query()
      .eager('lobbyMembers')
      .findById(id)
      .throwIfNotFound()
  },

  queryLobbies({ createdByUserId }) {
    console.log('CREATED BY USER ID', createdByUserId)
    return Lobby.query()
      .where('createdByUserId', createdByUserId)
      .eager('lobbyMembers')
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

  createNotification({ createdByUserId }) {
    return Notification.query()
      .insert({ createdByUserId })
      .returning(['id', 'sent', 'createdByUserId'])
  },

  getNotification({ id }) {
    return Notification.query()
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

  const implementation = Object.keys(sdk).reduce((impl, fnName) => {
    if (typeof pgInterface[fnName] !== 'function') {
      return Object.assign(impl, {
        [fnName]: sdk[fnName]
      })
    }
    return Object.assign(impl, {
      [fnName]: new Proxy(sdk[fnName], {
        apply: function(target, thisArg, argumentsList) {
          return pgInterface[fnName](...argumentsList)
        }
      })
    })
  }, {})

  return implementation
}

module.exports = readyUpPgConnector
