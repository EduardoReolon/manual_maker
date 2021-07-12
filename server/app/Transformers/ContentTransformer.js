'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ContentTransformer class
 *
 * @class ContentTransformer
 * @constructor
 */
class ContentTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      item_id: model.item_id,
      revision: model.revision,
      public: Boolean(model.public),
      content: model.content
    }
  }
}

module.exports = ContentTransformer
