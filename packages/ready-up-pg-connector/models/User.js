const Model = require('./BaseModel')

class User extends Model {
  static get tableName () {
    return 'users'
  }

  static get visibleFields () {
    return ['id', 'displayName']
  }
}

module.exports = User
