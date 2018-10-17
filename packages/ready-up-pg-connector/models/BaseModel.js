const { Model } = require('objection')

class BaseModel extends Model {
  static get modelPaths() {
    return [__dirname]
  }

  $beforeInsert() {
    this.createdAt = BaseModel.fn().now(6)
  }

  $beforeUpdate() {
    this.updatedAt = BaseModel.fn().now(6)
  }
}

module.exports = BaseModel
