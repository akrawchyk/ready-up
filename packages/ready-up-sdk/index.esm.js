function NotImplementedError() {
  Error.captureStackTrace(this, NotImplementedError)
}

const abstractInterface = {
  createSession() {
    throw new NotImplementedError()
  },
  getSession() {
    throw new NotImplementedError()
  },
  createUser() {
    throw new NotImplementedError()
  },
  updateUser() {
    throw new NotImplementedError()
  },
  getUser() {
    throw new NotImplementedError()
  },
  createLobby() {
    throw new NotImplementedError()
  },
  getLobby() {
    throw new NotImplementedError()
  },
  queryLobbies() {
    throw new NotImplementedError()
  },
  createLobbyMember() {
    throw new NotImplementedError()
  },
  getLobbyMember() {
    throw new NotImplementedError()
  },
  updateLobbyMember() {
    throw new NotImplementedError()
  },
  createNotification() {
    throw new NotImplementedError()
  },
  batchCreateNotifications() {
    throw new NotImplementedError()
  },
  getNotification() {
    throw new NotImplementedError()
  }
}

export default abstractInterface
export { NotImplementedError }
