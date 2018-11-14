const { join } = require('path')
const { readFileSync } = require('fs')

const fastify = require('fastify')({
  logger: true,
  https: {
    cert: readFileSync(process.env.READY_UP_SSL_CERT_PATH),
    key: readFileSync(process.env.READY_UP_SSL_KEY_PATH)
  }
})

fastify.register(require('fastify-helmet'))

fastify.register(require('fastify-cors'), {
  // FIXME use something to configure this as cast from csv string
  origin: (process.env.READY_UP_ALLOWED_ORIGINS || 'localhost').split(','),
  credentials: true
})
fastify.register(require('fastify-secure-session'), {
  key: readFileSync(process.env.READY_UP_SESSION_SECRET_KEY_PATH),
  cookie: {
    httpOnly: true,
    secure: true
  }
})
fastify.register(require('fastify-auth'))
fastify.register(require('fastify-sensible'))
fastify.register(require('fastify-ready-up'))
fastify.register(require('./plugins/fastify-errors'))

fastify.register(require('./users'))
fastify.register(require('./sessions'))
fastify.register(require('./lobbies'))
fastify.register(require('./lobbyMembers'))
fastify.register(require('./notifications'))

const listen = async () => {
  try {
    await fastify.ready()
    const address = await fastify.listen(
      process.env.READY_UP_LISTEN_PORT,
      process.env.READY_UP_LISTEN_ADDRESS
    )
    fastify.log.info(`server listening on ${address}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

listen()
