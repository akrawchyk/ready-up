const Model = require('../db/base-model')

class Lobby extends Model {
  static get tableName() {
    return 'lobbies'
  }

  static get relationMappings() {
    const User = require('../users/model')
    const LobbyMember = require('../lobbyMembers/model')

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'lobbies.createdByUserId',
          to: 'users.id'
        }
      },
      lobbyMembers: {
        relation: Model.HasManyRelation,
        modelClass: LobbyMember,
        join: {
          from: 'lobbies.id',
          to: 'lobbyMembers.lobbyId'
        }
      }
    }
  }
}

module.exports = Lobby
