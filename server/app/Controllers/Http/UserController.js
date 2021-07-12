'use strict'

const User = use('App/Models/User')
const UserTransformer = use('App/Transformers/UserTransformer')

class UserController {
  async login({ request, auth }) {
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token
  }

  async register({ request }) {
    const { email, password } = request.all()
    await User.create({
      email,
      password,
      username: email,
    })
    return await this.login(...arguments)
  }

  async me({ response, transform, auth }) {
    try {
      var user = await auth.getUser()

      const userData = await transform.item(user, UserTransformer)
      userData.roles = await user.getRoles()
      return response.send(userData)
    } catch (error) {
      console.log(error)      
      return response.status(400).send({
        message: 'error retrieving data'
      })
    }
  }
}

module.exports = UserController
