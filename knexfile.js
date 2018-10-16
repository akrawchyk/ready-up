const { pgConnectionString } = require('./options')

module.exports = {
  development: {
    client: 'postgresql',
    connection: pgConnectionString,
    migrations: {
      tableName: 'readyUpMigrations'
    }
  },

  test: {
    client: 'sqlite3',
    connection: { filename: ':memory:' },
    pool: {
      min: 1,
      max: 1
    }
  }

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }
}
