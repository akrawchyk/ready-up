const Model = require('./BaseModel')

class Session extends Model {
  static get tableName() {
    return 'sessions'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: 'sessions.userId',
          to: 'users.id'
        }
      }
    }
  }
}

module.exports = Session
