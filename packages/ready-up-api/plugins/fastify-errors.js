const fp = require('fastify-plugin')

class RequiredParametersMissingError extends Error {
  constructor(missingParameterKey) {
    super(`Required parameter missing: ${missingParameterKey}`)
  }
}

function fastifyErrors (fastify, opts, next) {
  fastify.decorate('RequiredParametersMissingError', RequiredParametersMissingError)
  next()
}

module.exports = fp(fastifyErrors)
