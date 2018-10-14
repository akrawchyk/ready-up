const fastify = require('fastify')({
  logger: true
})
const fastifyEnv = require('fastify-env')

const optionsSchema = {
  type: 'object',
  required: ['READY_UP_PORT'],
  properties: {
    READY_UP_PORT: {
      type: 'number',
      default: 3000
    }
  }
}

fastify.register(fastifyEnv, { schema: optionsSchema })
fastify.register(require('../users/routes'))

const listen = async () => {
  await fastify.ready()

  try {
    const port = fastify.config.READY_UP_PORT
    const address = await fastify.listen(port, '0.0.0.0')
    fastify.log.info(`server listening on ${address}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

module.exports = listen
