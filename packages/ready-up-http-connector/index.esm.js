import Request from 'superagent'
import prefix from 'superagent-prefix'

function readyUpHTTPConnector(sdk, opts) {
  const API_URL = opts.apiURL || 'https://localhost:3000'
  const agent = Request.agent()
    .use(prefix(API_URL))
    .withCredentials()
    .set('accept', 'json')

  const httpInterface = {
    async createSession({ userDisplayName, userPassword }) {
      return await agent
        .post(`/sessions`)
        .send({ userDisplayName, userPassword })
    },

    async getSession() {
      return await agent
        .get(`/sessions`)
        .withCredentials()
    },

    async createUser({ displayName, password }) {
      return await agent
        .post(`/users`)
        .send({ displayName, password })
    },

    async updateUser({ id, firebaseMessagingToken }) {
      return await agent
        .patch(`/users/${id}`)
        .send({ firebaseMessagingToken })
    },

    async getUser({ id }) {
      return await agent.get(`${API_URL}/users/${id}`).set('accept', 'json')
    },

    async createLobby({ createdByUserId, displayName }) {
      return await agent
        .post(`/lobbies`)
        .send({
          createdByUserId,
          displayName
        })
    },

    async getLobby({ id }) {
      return agent
        .get(`/lobbies/${id}`)
    },

    async createLobbyMember({ lobbyId, userId }) {
      return await agent
        .post(`/lobbyMembers`)
        .send({
          lobbyId,
          userId
        })
    },

    async getLobbyMember({ id }) {
      return await agent
        .get(`/lobbyMembers/${id}`)
    },

    async updateLobbyMember({ id, ready }) {
      return await agent
        .patch(`/lobbyMembers/${id}`)
        .send({ ready })
    }
  }

  return Object.keys(sdk).reduce((impl, fnName) => {
    if (typeof httpInterface[fnName] !== 'function') {
      return Object.assign(impl, {
        [fnName]: sdk[fnName]
      })
    }
    return Object.assign(impl, {
      [fnName]: new Proxy(sdk[fnName], {
        apply: async function(target, thisArg, argumentsList) {
          return await httpInterface[fnName](...argumentsList)
        }
      })
    })
  }, {})
}

export default readyUpHTTPConnector
