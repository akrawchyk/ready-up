const abstractInterface = {
  // BaseModel: {}, // for pg-connector only so far

  async createUser () { return Promise.reject('not implemented') },
  async getUser () { return Promise.reject('not implemented') },
  async createLobby () { return Promise.reject('not implemented') },
  async getLobby () { return Promise.reject('not implemented') },
  async createLobbyMember () { return Promise.reject('not implemented') },
  async getLobbyMember () { return Promise.reject('not implemented') },
  async createNotification () { return Promise.reject('not implemented') },
  async getNotification () { return Promise.reject('not implemented') },
}

export default abstractInterface
