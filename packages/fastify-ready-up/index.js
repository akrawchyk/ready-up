const fp = require('fastify-plugin')
const { ValidationError, NotFoundError } = require('objection')
const {
  wrapError,
  DBError,
  UniqueViolationError,
  ForeignKeyViolationError
} = require('objection-db-errors')
const pgConnector = require('ready-up-pg-connector')
const ReadyUpSDK = require('ready-up-sdk')
const notifier = require('ready-up-notifier')

function fastifyReadyUp(fastify, opts, next) {
  try {
    readyUpSDK = pgConnector(ReadyUpSDK, {
      pgConnectionString: process.env.READY_UP_PG_CONNECTION_STRING
    })
  } catch (err) {
    next(err)
    return
  }

  fastify.decorate('readyUp', readyUpSDK)
  fastify.decorate('notifier', notifier)
  fastify.decorateRequest('currentSession', null)
  fastify.decorate('verifyCurrentSession', async function(request, reply, done) {
    try {
      const sessionId = request.session.get('sessionId')
      if (!sessionId) {
        throw new Error('No sessionId found')
      }

      const currentSession = await readyUpSDK.getSession({ id: sessionId })
      request.currentSession = currentSession

      done()
    } catch (err) {
      console.error(err)
      done(new ReadyUpSDK.NotAuthorizedError())
    }
  })
  fastify.setErrorHandler(async function(err, request, reply) {
    err = wrapError(err)
    const retError = new Error()

    if (err instanceof ValidationError) {
      reply.code(400)
      retError.message = 'Bad Request'
      return retError
    } else if (err instanceof ReadyUpSDK.NotAuthorizedError) {
      reply.code(401)
      retError.message = 'Not Authorized'
      return retError
    } else if (err instanceof NotFoundError) {
      reply.code(404)
      retError.message = 'Not Found'
      return retError
    } else if (err instanceof UniqueViolationError) {
      reply.code(409)
      retError.message = 'Conflict'
      return retError
    } else if (err instanceof ForeignKeyViolationError) {
      reply.code(409)
      retError.message = 'Conflict'
      return retError
    } else if (err instanceof DBError) {
      reply.code(500)
      retError.message = 'Internal Server Error'
      return retError
    } else if (err instanceof ReadyUpSDK.NotImplementedError) {
      reply.code(501)
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
