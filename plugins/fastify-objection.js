const fastifyPlugin = require('fastify-plugin')
const Knex = require('knex')
const { Model } = require('objection')

function fastifyObjection (fastify, opts, next) {
  const { pgConnectionString } = opts

  try {
    const knex = Knex({
      client: 'pg',
      useNullAsDefault: true,
      connection: pgConnectionString
    })

    Model.knex(knex)

    fastify.decorate('knex', knex)
    fastify.decorate('Model', Model)

    next()
  } catch(err) {
    next(err)
  }
}

module.exports = fastifyPlugin(fastifyObjection, '>=0.30.0')
