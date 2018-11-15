import Request from 'superagent'
import prefix from 'superagent-prefix'

function readyUpHTTPConnector(sdk, opts) {
  const API_URL = opts.apiURL || 'https://localhost:3000'
  const agent = Request.agent()
    .use(prefix(API_URL))
    .withCredentials()
    .set('accept', 'json')

  const httpInterface = {
    createSession({ userDisplayName, userPassword }) {
      return agent.post(`/sessions`).send({ userDisplayName, userPassword })
    },

    getSession() {
      return agent.get(`/sessions`)
    },

    createUser({ displayName, password }) {
      return agent.post(`/users`).send({ displayName, password })
    },

    updateUser({ id, firebaseMessagingToken }) {
      return agent.patch(`/users/${id}`).send({ firebaseMessagingToken })
    },

    getUser({ id }) {
      return agent.get(`/users/${id}`)
    },

    createLobby({ createdByUserId, displayName }) {
      return agent.post(`/lobbies`).send({
        createdByUserId,
        displayName
      })
    },

    getLobby({ id }) {
      return agent.get(`/lobbies/${id}`)
    },

    queryLobbies() {
      return agent.get(`/lobbies`)
    },

    createLobbyMember({ lobbyId, userId }) {
      return agent.post(`/lobbyMembers`).send({
        lobbyId,
        userId
      })
    },

    getLobbyMember({ id }) {
      return agent.get(`/lobbyMembers/${id}`)
    },

    updateLobbyMember({ id, ready }) {
      return agent.patch(`/lobbyMembers/${id}`).send({ ready })
    }
  }

  return Object.keys(sdk).reduce((impl, fnName) => {
    return Object.assign(impl, {
      [fnName]: new Proxy(sdk[fnName], {
        apply: function(target, thisArg, argumentsList) {
          if (typeof httpInterface[fnName] !== 'function') {
            return Reflect.apply(target, thisArg, argumentsList)
          }
          return httpInterface[fnName](...argumentsList)
        }
      })
    })
  }, {})
}

export default readyUpHTTPConnector
