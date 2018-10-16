const fastify = require('fastify')({ logger: true })
const { httpPort, pgConnectionString } = require('ready-up-options')
const { BaseModel } = require('ready-up-sdk')

fastify.register(require('fastify-objection'), {
  pgConnectionString,
  BaseModelClass: BaseModel
})
  .after(err => {
    if (err) throw err
  })
fastify.register(require('fastify-ready-up'))
fastify.register(require('./plugins/fastify-http-status'))
fastify.register(require('./plugins/fastify-errors'))

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
