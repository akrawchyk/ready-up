const fp = require('fastify-plugin')

const TABLE_NAME = 'lobbies'

async function createLobbiesSchema(knex) {
  const hasTable = await knex.schema.hasTable(TABLE_NAME)

  if (!hasTable) {
    return knex.schema.createTable(TABLE_NAME, table => {
      table.increments('id').primary()
      table.string('displayName')
      table.integer('createdByUserId')
      table.foreign('createdByUserId').references('users.id')
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6))
      table.timestamp('updatedAt', 6)
    })
  }
}

function createLobbyModel(Model) {
  return class Lobby extends Model {
    static get tableName() {
      return TABLE_NAME
    }

    static get relationalMappings() {
      return {

      }
    }
  }
}

async function lobbyModel (fastify, opts, next) {
  try {
    await createLobbiesSchema(fastify.knex)
    fastify.decorate('Lobby', createLobbyModel(fastify.Model))
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(lobbyModel)
