const fp = require('fastify-plugin')
const { Model } = require('objection')

const TABLE_NAME = 'users'

class User extends Model {
  static get tableName() {
    return TABLE_NAME
  }
}

async function createUsersSchema(knex) {
  const hasTable = await knex.schema.hasTable(TABLE_NAME)

  if (!hasTable) {
    return knex.schema.createTable(TABLE_NAME, table => {
      table.increments('id').primary()
      table.string('displayName')
    })
  }
}

async function userModel (fastify, opts, next) {
  try {
    await createUsersSchema(fastify.knex)
    fastify.decorate('User', User)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(userModel, '>=0.30.0')
