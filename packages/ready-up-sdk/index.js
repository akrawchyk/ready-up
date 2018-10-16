const User = require('./models/User')
const Lobby = require('./models/Lobby')
const LobbyMember = require('./models/LobbyMember')

async function createUser ({ displayName }) {
  return await User.query()
    .insert({ displayName })
}

async function getUser ({ id }) {
  return await User.query()
    .findById(id)
    .throwIfNotFound()
}

async function createLobby ({ createdByUserId, displayName }) {
  // TODO: if no displayName create random
  return await Lobby.query()
    .insert({ createdByUserId, displayName })
}

async function getLobby ({ id }) {
  return await Lobby.query()
    .eager('lobbyMembers')
    .findById(id)
    .throwIfNotFound()
}

async function createLobbyMember ({ lobbyId, userId }) {
  return await LobbyMember.query()
    .insert({ lobbyId, userId })
}

async function getLobbyMember ({ id }) {
  return await LobbyMember.query()
    .findById(id)
    .throwIfNotFound()
}

module.exports = {
  createUser,
  getUser,
  createLobby,
  getLobby,
  createLobbyMember,
  getLobbyMember
}
