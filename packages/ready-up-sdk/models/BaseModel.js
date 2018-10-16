const { Model } = require('objection')
const { DbErrors } = require('objection-db-errors')

class BaseModel extends DbErrors(Model) {
  static get modelPaths() {
    return [__dirname]
  }

  $beforeInsert() {
    this.createdAt = new Date().toISOString()
    // FIXME why no access to Model.fn()?
    // this.createdAt = Model.fn().now(6)
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString()
    // FIXME why no access to Model.fn()?
    // this.updatedAt = Model.fn().now(6)
  }
}

module.exports = BaseModel
