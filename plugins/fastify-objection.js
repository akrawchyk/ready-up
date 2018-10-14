const fp = require('fastify-plugin')
const Knex = require('knex')
const { Model } = require('objection')
const { UniqueViolationError } = require('objection-db-errors')


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

    class BaseModel extends Model {
      $beforeInsert() {
        this.createdAt = knex.fn.now(6)
      }

      $beforeUpdate() {
        this.updatedAt = knex.fn.now(6)
      }
    }

    fastify.decorate('knex', knex)
    fastify.decorate('Model', BaseModel)
    fastify.addHook('onClose', async (instance, done) => {
      try {
        await knex.destroy()
        done()
      } catch (err) {
        fastify.log.error(err)
        done()
      }
    })

    fastify.setErrorHandler(function (error, request, reply) {
      console.log(error.message)

    })

    next()
  } catch(err) {
    next(err)
  }
}

module.exports = fp(fastifyObjection, '>=0.30.0')
