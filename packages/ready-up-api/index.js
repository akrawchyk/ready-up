const { join } = require('path')
const { readFileSync } = require('fs')

const fastify = require('fastify')({
  logger: true,
  https: {
    key: readFileSync(join(__dirname, 'server.key')),
    cert: readFileSync(join(__dirname, 'server.crt'))
  }
})

fastify.register(require('fastify-cors'), {
  origin: ['https://localhost:8080', 'https://localhost:8000'],
  credentials: true
})
fastify.register(require('fastify-secure-session'), {
  key: readFileSync(join(__dirname, 'secret-key')),
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
fastify.register(require('./lobbies'))
fastify.register(require('./lobbyMembers'))
fastify.register(require('./notifications'))
fastify.register(require('./sessions'))

const listen = async () => {
  try {
    await fastify.ready(err => {
      if (err) {
        throw err
      }
    })

    const address = await fastify.listen(3000, '0.0.0.0')
    fastify.log.info(`server listening on ${address}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

listen()
