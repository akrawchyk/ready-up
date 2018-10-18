const Model = require('./BaseModel')

class Notification extends Model {
  static get tableName() {
    return 'notifications'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: 'notifications.createdByUserId',
          to: 'users.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: 'notifications.recipientUserId',
          to: 'users.id'
        }
      }
    }
  }
}

module.exports = Notification
