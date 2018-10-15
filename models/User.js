const Model = require('./BaseModel')

class User extends Model {
  static get tableName() {
    return 'users'
  }
}

module.exports = User
