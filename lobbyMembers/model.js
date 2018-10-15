const Model = require('../db/base-model')

class LobbyMember extends Model {
  static getTableName() {
    return 'lobbyMembers'
  }

  static get relationMappings() {
    const User = require('../users/model')
    const Lobby = require('../lobbies/model')

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'lobbyMembers.userId',
          to: 'users.id'
        }
      },
      lobby: {
        relation: Model.BelongsToOneRelation,
        modelClass: Lobby,
        join: {
          from: 'lobbyMembers.lobbyId',
          to: 'lobbies.id'
        }
      }
    }
  }
}

module.exports = LobbyMember
