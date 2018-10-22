const Model = require('./BaseModel')

class Lobby extends Model {
  static get tableName () {
    return 'lobbies'
  }

  static get relationMappings () {
    return {
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: 'lobbies.createdByUserId',
          to: 'users.id'
        }
      },
      lobbyMembers: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/LobbyMember`,
        join: {
          from: 'lobbies.id',
          to: 'lobbyMembers.lobbyId'
        }
      }
    }
  }
}

module.exports = Lobby
