const Model = require('../db/base-model')

class User extends Model {
  static get tableName() {
    return 'users'
  }
}

module.exports = User
