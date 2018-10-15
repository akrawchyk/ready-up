const fp = require('fastify-plugin')
const User = require('../models/User')

async function userPlugin (fastify, opts, next) {
  try {
    fastify.decorate('User', User)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(userPlugin)
