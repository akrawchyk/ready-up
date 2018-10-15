const fp = require('fastify-plugin')
const LobbyMember = require('./model')
const TABLE_NAME = 'lobbyMembers'

async function createLobbyMembersSchema(knex) {
  const hasTable = await knex.schema.hasTable(TABLE_NAME)

  if (!hasTable) {
    return knex.schema.createTable(TABLE_NAME, table => {
      table.increments('id').primary()
      table.integer('lobbyId')
      table.foreign('lobbyId').references('lobbies.id')
      table.integer('userId')
      table.foreign('userId').references('users.id')
      table.unique(['lobbyId', 'userId'])
      table.boolean('ready').defaultTo(false)
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6))
      table.timestamp('updatedAt', 6)
    })
  }
}

async function lobbyMemberModel (fastify, opts, next) {
  try {
    await createLobbyMembersSchema(fastify.knex)
    fastify.decorate('LobbyMember', LobbyMember)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fp(lobbyMemberModel)
