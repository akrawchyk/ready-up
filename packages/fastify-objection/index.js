const fp = require('fastify-plugin')
const status = require('http-status')
const Knex = require('knex')
const { Model, ValidationError, NotFoundError } = require('objection')
const {
  DBError,
  UniqueViolationError,
  ForeignKeyViolationError
} = require('objection-db-errors')

const isDevelopment = process.env.NODE_ENV !== 'production'

function fastifyObjection (fastify, opts, next) {
  const {
    pgConnectionString,
    BaseModelClass
  } = opts
  let knex

  try {
    knex = Knex({
      client: 'pg',
      useNullAsDefault: true,
      asyncStackTraces: isDevelopment,
      connection: pgConnectionString
    })
  } catch(err) {
    next(err)
    return
  }

  if (BaseModelClass) {
    BaseModelClass.knex(knex)
    fastify.decorate('Model', BaseModelClass)
  } else {
    Model.knex(knex)
    fastify.decorate('Model', Model)
  }

  fastify.decorate('knex', knex)
  fastify.addHook('onClose', async (instance, done) => {
    try {
      await knex.destroy()
      done()
    } catch (err) {
      fastify.log.error(err)
      done()
    }
  })

  fastify.setErrorHandler(async function (err, request, reply) {
    if (err instanceof ValidationError) {
      reply.code(status.UNPROCESSABLE_ENTITY)
    } else if (err instanceof NotFoundError) {
      reply.code(status.NOT_FOUND)
    } else if (err instanceof UniqueViolationError) {
      reply.code(status.CONFLICT)
    } else if (err instanceof ForeignKeyViolationError) {
      reply.code(status.CONFLICT)
    }

    return new Error(err.type)
  })

  next()
}

module.exports = fp(fastifyObjection, '>=0.30.0')
