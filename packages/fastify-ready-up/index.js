const fp = require('fastify-plugin')
const ReadyUp = require('ready-up-sdk')

// TODO move knex and objection initialization in here?
// const {
//   pgConnectionString,
//   BaseModelClass
// } = opts
// let knex
//
// try {
//   knex = Knex({
//     client: 'pg',
//     useNullAsDefault: true,
//     asyncStackTraces: isDevelopment,
//     connection: pgConnectionString
//   })
// } catch(err) {
//   return
// }
//
// ReadyUp.BaseModel.knex(knex)

function fastifyReadyUp (fastify, opts, next) {
  fastify.decorate('ReadyUp', ReadyUp)
  next()
}

module.exports = fp(fastifyReadyUp)
