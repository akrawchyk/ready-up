const fp = require('fastify-plugin')
const status = require('http-status')
const Knex = require('knex')
const {
  ValidationError,
  NotFoundError } = require('objection')
const {
  wrapError,
  DBError,
  UniqueViolationError,
  ForeignKeyViolationError } = require('objection-db-errors')
const ReadyUp = require('ready-up-sdk')
const { pgConnectionString } = require('ready-up-options')

function fastifyReadyUp (fastify, opts, next) {
  let knex

  try {
    const isDevelopment = process.env.NODE_ENV !== 'production'
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

  ReadyUp.BaseModel.knex(knex)

  fastify.decorate('ReadyUp', ReadyUp)
  fastify.setErrorHandler(async function (err, request, reply) {
    err = wrapError(err)

    if (err instanceof ValidationError) {
      reply.unprocessableEntity()
      return new Error(err.type)
    } else if (err instanceof NotFoundError) {
      reply.notFound()
      return new Error(err.type)
    } else if (err instanceof UniqueViolationError) {
      reply.conflict()
      return new Error(err.type)
    } else if (err instanceof ForeignKeyViolationError) {
      reply.conflict()
      return new Error(err.type)
    } else if (err instanceof DBError) {
      return err
    }

    return err
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
