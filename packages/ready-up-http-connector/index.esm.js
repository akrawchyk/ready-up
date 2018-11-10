import Request from 'superagent'

function readyUpHTTPConnector(sdk, opts) {
  const API_URL = opts.apiURL || 'https://localhost:3000'
  const agent = Request.agent()

  const httpInterface = {
    async createSession({ userDisplayName, userPassword }) {
      return await agent
        .post(`${API_URL}/sessions`)
        .send({ userDisplayName, userPassword })
        .withCredentials()
        .set('accept', 'json')
    },

    async getSession() {
      return await agent
        .get(`${API_URL}/sessions`)
        .withCredentials()
        .set('accept', 'json')
    },

    async createUser({ displayName, password }) {
      return await agent
        .post(`${API_URL}/users`)
        .send({ displayName, password })
        .set('accept', 'json')
    },

    async updateUser({ id, firebaseMessagingToken }) {
      return await agent
        .patch(`${API_URL}/users/${id}`)
        .send({ firebaseMessagingToken })
        .withCredentials()
        .set('accept', 'json')
    },

    async getUser({ id }) {
      return await agent.get(`${API_URL}/users/${id}`).set('accept', 'json')
    },

    async createLobby({ createdByUserId, displayName }) {
      return await agent
        .post(`${API_URL}/lobbies`)
        .send({
          createdByUserId,
          displayName
        })
        .withCredentials()
        .set('accept', 'json')
    },

    async getLobby({ id }) {
      return agent
        .get(`${API_URL}/lobbies/${id}`)
        .withCredentials()
        .set('accept', 'json')
    },

    async createLobbyMember({ lobbyId, userId }) {
      return await agent
        .post(`${API_URL}/lobbyMembers`)
        .send({
          lobbyId,
          userId
        })
        .withCredentials()
        .set('accept', 'json')
    },

    async getLobbyMember({ id }) {
      return await agent
        .get(`${API_URL}/lobbyMembers/${id}`)
        .withCredentials()
        .set('accept', 'json')
    },

    async updateLobbyMember({ id, ready }) {
      return await agent
        .patch(`${API_URL}/lobbyMembers/${id}`)
        .send({ ready })
        .withCredentials()
        .set('accept', 'json')
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
