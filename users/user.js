const fp = require('fastify-plugin')

const TABLE_NAME = 'users'

async function createUsersSchema(knex) {
  const hasTable = await knex.schema.hasTable(TABLE_NAME)

  if (!hasTable) {
    return knex.schema.createTable(TABLE_NAME, table => {
      table.increments('id').primary()
      table.string('displayName')
      table.unique('displayName')
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6))
      table.timestamp('updatedAt', 6)
    })
  }
}

function createUserModel(Model) {
  return class User extends Model {
    static get tableName() {
      return TABLE_NAME
    }

    static get relationMappings() {
      return {

      }
    }
  }
}


async function userModel (fastify, opts, next) {
  try {
    await createUsersSchema(fastify.knex)
    fastify.decorate('User', createUserModel(fastify.Model))
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(userModel, '>=0.30.0')
