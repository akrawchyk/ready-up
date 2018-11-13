class NotImplementedError extends Error {
  constructor() {
    super('Not Implemented')
  }
}

class NotAuthorizedError extends Error {
  constructor() {
    super('Not Authorized')
  }
}

const abstractInterface = {
  async createSession() {
    return Promise.reject(new NotImplementedError())
  },
  async getSession() {
    return Promise.reject(new NotImplementedError())
  },
  async createUser() {
    return Promise.reject(new NotImplementedError())
  },
  async updateUser() {
    return Promise.reject(new NotImplementedError())
  },
  async getUser() {
    return Promise.reject(new NotImplementedError())
  },
  async createLobby() {
    return Promise.reject(new NotImplementedError())
  },
  async getLobby() {
    return Promise.reject(new NotImplementedError())
  },
  async queryLobbies() {
    return Promise.reject(new NotImplementedError())
  },
  async createLobbyMember() {
    return Promise.reject(new NotImplementedError())
  },
  async getLobbyMember() {
    return Promise.reject(new NotImplementedError())
  },
  async updateLobbyMember() {
    return Promise.reject(new NotImplementedError())
  },
  async createNotification() {
    return Promise.reject(new NotImplementedError())
  },
  async getNotification() {
    return Promise.reject(new NotImplementedError())
  }
}

module.exports = abstractInterface
module.exports.NotImplementedError = NotImplementedError
module.exports.NotAuthorizedError = NotAuthorizedError
