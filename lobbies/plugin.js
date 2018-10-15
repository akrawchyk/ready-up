const fp = require('fastify-plugin')
const Lobby = require('../models/Lobby')

async function lobbyPlugin (fastify, opts, next) {
  try {
    fastify.decorate('Lobby', Lobby)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(lobbyPlugin)
