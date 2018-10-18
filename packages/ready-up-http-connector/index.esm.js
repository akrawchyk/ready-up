import Request from 'superagent'

function readyUpHTTPConnector(sdk, opts) {
  const API_URL = opts.apiURL || 'https://localhost:3000'

  const httpInterface = {
    async createUser ({ displayName }) {
      return await Request.post(`${API_URL}/users`)
        .send({ displayName })
        .set('accept', 'json')
    },

    async getUser ({ id }) {
      return await Request.get(`${API_URL}/users/${id}`)
        .set('accept', 'json')
    },

    async createLobby ({ createdByUserId, displayName }) {
      return await Request.post(`${API_URL}/lobbies`)
        .send({
          createdByUserId,
          displayName
        })
        .set('accept', 'json')
    },

    async getLobby ({ id }) {
      return Request.get(`${API_URL}/lobbies/${id}`)
        .set('accept', 'json')
    },

    async createLobbyMember ({ lobbyId, userId }) {
      return await Request.post(`${API_URL}/lobbyMembers`)
        .send({
          lobbyId,
          userId
        })
        .set('accept', 'json')
    },

    async getLobbyMember ({ id }) {
      return await Request.get(`${API_URL}/lobbyMembers/${id}`)
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
