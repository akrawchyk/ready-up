module.exports = {
  client: 'postgresql',
  connection: process.env.READY_UP_PG_CONNECTION_STRING,
  migrations: {
    tableName: 'readyUpMigrations'
  }

  // test: {
  //   client: 'sqlite3',
  //   connection: { filename: ':memory:' },
  //   pool: {
  //     min: 1,
  //     max: 1
  //   }
  // }

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
