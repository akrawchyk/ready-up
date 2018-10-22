class NotImplementedError extends Error {
  constructor() {
    if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, NotImplementedError);
    }
    super('Not Implemented')
  }
}

const abstractInterface = {
  // BaseModel: {}, // for pg-connector only so far

  async createSession () { return Promise.reject(new NotImplementedError()) },
  async getSession () { return Promise.reject(new NotImplementedError()) },
  async createUser () { return Promise.reject(new NotImplementedError()) },
  async updateUser () { return Promise.reject(new NotImplementedError()) },
  async getUser () { return Promise.reject(new NotImplementedError()) },
  async createLobby () { return Promise.reject(new NotImplementedError()) },
  async getLobby () { return Promise.reject(new NotImplementedError()) },
  async createLobbyMember () { return Promise.reject(new NotImplementedError()) },
  async getLobbyMember () { return Promise.reject(new NotImplementedError()) },
  async updateLobbyMember () { return Promise.reject(new NotImplementedError()) },
  async createNotification () { return Promise.reject(new NotImplementedError()) },
  async getNotification () { return Promise.reject(new NotImplementedError()) },
}

export default abstractInterface
export {
  NotImplementedError
}
