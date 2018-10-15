const { Model } = require('objection')
const { DbErrors } = require('objection-db-errors')

class BaseModel extends DbErrors(Model) {
  $beforeInsert() {
    this.createdAt = Model.fn().now(6)
  }

  $beforeUpdate() {
    this.updatedAt = Model.fn().now(6)
  }
}

module.exports = BaseModel
