const fp = require('fastify-plugin')
const Knex = require('knex')
const { Model } = require('objection')

const isDevelopment = process.env.NODE_ENV !== 'production'

function fastifyObjection (fastify, opts, next) {
  const { pgConnectionString } = opts

  try {
    const knex = Knex({
      client: 'pg',
      useNullAsDefault: true,
      asyncStackTraces: isDevelopment,
      connection: pgConnectionString
    })

    Model.knex(knex)

    fastify.decorate('knex', knex)
    fastify.decorate('Model', Model)
    fastify.addHook('onClose', async (instance, done) => {
      try {
        await knex.destroy()
        done()
      } catch (err) {
        fastify.log.error(err)
        done()
      }
    })

    next()
  } catch(err) {
    next(err)
  }
}

module.exports = fp(fastifyObjection, '>=0.30.0')
