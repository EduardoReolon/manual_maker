'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * UserTransformer class
 *
 * @class UserTransformer
 * @constructor
 */
class UserTransformer extends BumblebeeTransformer {
  transform (model) {
    return {
      id: model.id,
      username: model.username,
      email: model.email
    }
  }
}

module.exports = UserTransformer
