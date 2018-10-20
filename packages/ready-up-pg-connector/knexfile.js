module.exports = {
  development: {
    client: 'postgresql',
    connection: 'postgresql://postgres@localhost/ready-up',
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
