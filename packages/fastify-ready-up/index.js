const fp = require('fastify-plugin')
const status = require('http-status')
const Knex = require('knex')
const { Model, ValidationError, NotFoundError } = require('objection')
const {
  DBError,
  UniqueViolationError,
  ForeignKeyViolationError
} = require('objection-db-errors')
const ReadyUp = require('ready-up-sdk')
const { pgConnectionString } = require('ready-up-options')

function fastifyReadyUp (fastify, opts, next) {
  try {
    const isDevelopment = process.env.NODE_ENV !== 'production'
    const knex = Knex({
      client: 'pg',
      useNullAsDefault: true,
      asyncStackTraces: isDevelopment,
      connection: pgConnectionString
    })

    ReadyUp.BaseModel.knex(knex)
  } catch(err) {
    next(err)
    return
  }

  fastify.decorate('ReadyUp', ReadyUp)
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
  fastify.addHook('onClose', async (instance, done) => {
    try {
      await knex.destroy()
    } catch (err) {
      fastify.log.error(err)
    }

    done()
  })

  next()
}

module.exports = fp(fastifyReadyUp)
