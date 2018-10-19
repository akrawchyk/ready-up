import Request from 'superagent'

function readyUpHTTPConnector(sdk, opts) {
  const API_URL = opts.apiURL || 'https://localhost:3000'
  const agent = Request.agent()

  const httpInterface = {
    async createSession ({ userDisplayName, userPassword }) {
      return await agent.post(`${API_URL}/sessions`)
        .send({ userDisplayName, userPassword })
        .set('accept', 'json')
    },

    async createUser ({ displayName, password }) {
      return await agent.post(`${API_URL}/users`)
        .send({ displayName, password })
        .set('accept', 'json')
    },

    async getUser ({ id }) {
      return await agent.get(`${API_URL}/users/${id}`)
        .set('accept', 'json')
    },

    async createLobby ({ createdByUserId, displayName }) {
      return await agent.post(`${API_URL}/lobbies`)
        .send({
          createdByUserId,
          displayName
        })
        .withCredentials()
        .set('accept', 'json')
    },

    async getLobby ({ id }) {
      return agent.get(`${API_URL}/lobbies/${id}`)
        .set('accept', 'json')
    },

    async createLobbyMember ({ lobbyId, userId }) {
      return await agent.post(`${API_URL}/lobbyMembers`)
        .send({
          lobbyId,
          userId
        })
        .set('accept', 'json')
    },

    async getLobbyMember ({ id }) {
      return await agent.get(`${API_URL}/lobbyMembers/${id}`)
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
