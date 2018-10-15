const fp = require('fastify-plugin')
const LobbyMember = require('../models/LobbyMember')

async function lobbyMemberPlugin (fastify, opts, next) {
  try {
    fastify.decorate('LobbyMember', LobbyMember)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(lobbyMemberPlugin)
