class NotImplementedError extends Error {
  constructor() {
    super('Not Implemented')
  }
}

const abstractInterface = {
  // BaseModel: {}, // for pg-connector only so far

  async createUser () { return Promise.reject(new NotImplementedError()) },
  async getUser () { return Promise.reject(new NotImplementedError()) },
  async createLobby () { return Promise.reject(new NotImplementedError()) },
  async getLobby () { return Promise.reject(new NotImplementedError()) },
  async createLobbyMember () { return Promise.reject(new NotImplementedError()) },
  async getLobbyMember () { return Promise.reject(new NotImplementedError()) },
  async createNotification () { return Promise.reject(new NotImplementedError()) },
  async getNotification () { return Promise.reject(new NotImplementedError()) },
}

module.exports = abstractInterface
module.exports.NotImplementedError = NotImplementedError
