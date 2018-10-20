exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary()
      table.string('displayName').notNullable()
      table.unique('displayName')
      table.string('hashedPassword').notNullable()
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6)).notNullable()
      table.timestamp('updatedAt', 6)
    })
    .createTable('sessions', table => {
      table.increments('id').primary()
      table.string('userId').notNullable()
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6)).notNullable()
      table.timestamp('updatedAt', 6)
    })
    .createTable('lobbies', table => {
      table.increments('id').primary()
      table.string('displayName')
      table.integer('createdByUserId').unsigned().references('users.id').notNullable()
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6)).notNullable()
      table.timestamp('updatedAt', 6)
    })
    .createTable('lobbyMembers', table => {
      table.increments('id').primary()
      table.integer('lobbyId').unsigned().references('lobbies.id').notNullable()
      table.integer('userId').unsigned().references('users.id').notNullable()
      table.unique(['lobbyId', 'userId'])
      table.boolean('ready').defaultTo(false).notNullable()
      table.integer('createdByUserId').unsigned().references('users.id').notNullable()
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6)).notNullable()
      table.timestamp('updatedAt', 6)
    })
    .createTable('notifications', table => {
      table.increments('id').primary()
      table.integer('createdByUserId').unsigned().references('users.id').notNullable()
      table.integer('recipientUserId').unsigned().references('users.id').notNullable()
      table.boolean('sent').defaultTo(false).notNullable()
      table.timestamp('createdAt', 6).defaultTo(knex.fn.now(6)).notNullable()
      table.timestamp('updatedAt', 6)
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('notifications')
    .dropTable('lobbyMembers')
    .dropTable('lobbies')
    .dropTable('sessions')
    .dropTable('users')
}
