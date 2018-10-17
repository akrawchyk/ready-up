const request = require('superagent')

const API_URL = 'http://localhost:3000'

const httpInterface = {
  async createUser ({ displayName }) {
    return await request.post(`${API_URL}/users`)
      .send({ displayName })
      .set('accept', 'json')
  },

  async getUser ({ id }) {
    return await request.get(`${API_URL}/users/${id}`)
  },

  async createLobby ({ createdByUserId, displayName }) {
    return await request.post(`${API_URL}/users`)
      .send({
        createdByUserId,
        displayName
      })
      .set('accept', 'json')
  },

  async getLobby ({ id }) {
    return request.get(`${API_URL}/lobbies/${id}`)
  },

  async createLobbyMember ({ lobbyId, userId }) {
    return await request.post(`${API_URL}/users`)
      .send({
        lobbyId,
        userId
      })
      .set('accept', 'json')
  },

  async getLobbyMember ({ id }) {
    return request.get(`${API_URL}/lobbyMembers/${id}`)
  }
}

function readyUpHTTPConnector(sdk) {
  return Object.keys(httpInterface).reduce((impl, fnName) => {
    return Object.assign(impl, {
      fnName: new Proxy(sdk[fnName], {
        apply: async function(target, thisArg, argumentsList) {
          return await httpInterface[fnName](...argumentsList)
        }
      })
    })
  }, {})
}

module.exports = readyUpHTTPConnector
