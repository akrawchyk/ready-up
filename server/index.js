const fastify = require('fastify')({
  logger: true
})

fastify.register(require('../users/routes'))

const listen = async ({ httpPort }) => {
  try {
    const address = await fastify.listen(httpPort, '0.0.0.0')
    fastify.log.info(`server listening on ${address}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

module.exports = listen
