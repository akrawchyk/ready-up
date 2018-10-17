const { Model } = require('objection')
const { DbErrors } = require('objection-db-errors')

class BaseModel extends DbErrors(Model) {
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
