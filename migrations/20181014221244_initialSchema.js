exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary()
      table.string('displayName')
      table.unique('displayName')
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6))
      table.timestamp('updatedAt', 6)
    })
    .createTable('lobbies', table => {
      table.increments('id').primary()
      table.string('displayName')
      table.integer('createdByUserId').unsigned().references('users.id')
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6))
      table.timestamp('updatedAt', 6)
    })
    .createTable('lobbyMembers', table => {
      table.increments('id').primary()
      table.integer('lobbyId').unsigned().references('lobbies.id')
      table.integer('userId').unsigned().references('users.id')
      table.unique(['lobbyId', 'userId'])
      table.boolean('ready').defaultTo(false)
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6))
      table.timestamp('updatedAt', 6)
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('lobbies')
    .dropTable('lobbyMembers')
    .dropTable('users')
}
