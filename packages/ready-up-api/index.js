const fastify = require('fastify')({ logger: true })
const { httpPort } = require('ready-up-options')

fastify.register(require('fastify-ready-up'))
fastify.register(require('./plugins/fastify-http-status'))
fastify.register(require('./plugins/fastify-errors'))

fastify.register(require('./users'))
fastify.register(require('./lobbies'))
fastify.register(require('./lobbyMembers'))

const listen = async () => {
  try {
    await fastify.ready(err => {
      if (err) {
        throw err
      }
    })

    const address = await fastify.listen(httpPort, '0.0.0.0')
    fastify.log.info(`server listening on ${address}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

listen()
