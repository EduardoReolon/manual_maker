'use strict'

const { manage_single_upload, manage_multiple_uploads } = use('App/Helpers')
const Env = use('Env')

class FileController {
  /**
   * Create/save a new image.
   * POST images
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
   async store({ params: {groupName}, request, response, transform }) {
    try {
      // captura uma image ou mais do request
      const fileJar = request.file('upload', {
        types: ['image'],
        size: '2mb'
      })

      if (!fileJar) return response.status(400).send({msg: 'Error with the file'})

      let files = await manage_multiple_uploads(fileJar.files ? fileJar.files : [fileJar], null, groupName)

      if (files.errors.length) return response.status(400).send(files.errors)

      return response.status(201).send({
        fileName: files.successes[0].fileName,
        uploaded: 1,
        url: `${Env.get('startPathFiles', '')}/storage/${groupName}/${files.successes[0].fileName}`
      })
    } catch (error) {
      console.log(error)
      return response.status(400).send({
        message: 'Não foi possível processar a sua solicitação!'
      })
    }
  }
}

module.exports = FileController
