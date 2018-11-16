function NotImplementedError() {
  Error.captureStackTrace(this, NotImplementedError)
}

function NotAuthorizedError () {
  Error.captureStackTrace(this, NotAuthorizedError)
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

module.exports = abstractInterface
module.exports.NotImplementedError = NotImplementedError
module.exports.NotAuthorizedError = NotAuthorizedError
