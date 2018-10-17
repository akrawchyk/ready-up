const fp = require('fastify-plugin')

class InvalidParametersError extends Error {
  constructor(missingParameterKey) {
    super(`Invalid parameters: ${missingParameterKey}`)
  }
}

function fastifyErrors (fastify, opts, next) {
  fastify.decorate('InvalidParametersError', InvalidParametersError)
  next()
}

module.exports = fp(fastifyErrors)
