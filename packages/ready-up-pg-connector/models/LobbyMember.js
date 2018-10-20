const Model = require('./BaseModel')

class LobbyMember extends Model {
  static get tableName() {
    return 'lobbyMembers'
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: 'lobbyMembers.userId',
          to: 'users.id'
        }
      },
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: 'lobbyMembers.createdByUserId',
          to: 'users.id'
        }
      },
      lobby: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Lobby`,
        join: {
          from: 'lobbyMembers.lobbyId',
          to: 'lobbies.id'
        }
      }
    }
  }
}

module.exports = LobbyMember
