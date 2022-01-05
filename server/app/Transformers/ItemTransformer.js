'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ItemTransformer class
 *
 * @class ItemTransformer
 * @constructor
 */
class ItemTransformer extends BumblebeeTransformer {
  static get availableInclude () {
    return [
      'content'
    ]
  }
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      description: model.description,
      id_parent: model.id_parent,
      external: Boolean(model.external),
    }
  }

  includeContent (model) {
    const ContentTransformer = use('App/Transformers/ContentTransformer')
    return this.collection(model.getRelated('content'), ContentTransformer)
  }
}

module.exports = ItemTransformer
