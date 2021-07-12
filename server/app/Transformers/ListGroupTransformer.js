'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ListGroupTransformer class
 *
 * @class ListGroupTransformer
 * @constructor
 */
class ListGroupTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      name: model.name,
    }
  }
}

module.exports = ListGroupTransformer
