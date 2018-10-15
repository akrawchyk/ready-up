const fastify = require('fastify')({
  logger: true
})
const fastifyHttpStatus = require('./plugins/fastify-http-status')
const fastifyObjection = require('./plugins/fastify-objection')
const { httpPort, pgConnectionString } = require('./options')

fastify.register(fastifyHttpStatus)
fastify.register(fastifyObjection, { pgConnectionString })
  .after(err => {
    if (err) throw err
  })
fastify.register(require('./users'))
fastify.register(require('./lobbies'))
fastify.register(require('./lobbyMembers'))

const listen = async () => {
  try {
    const address = await fastify.listen(httpPort, '0.0.0.0')
    fastify.log.info(`server listening on ${address}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

listen()
