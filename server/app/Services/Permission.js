'use strict'

const ListGroup = use('App/Models/ListGroup')

class Permission {
  async groupCheckUser(userId, groupName) {
    const listGoup = await ListGroup.query()
      .where('name', groupName)
      .first();
    if (listGoup) {
      const usersAllowed = listGoup.users.split(',');
      if (usersAllowed.indexOf(userId.toString()) < 0) return {status: 400, msg: 'user not allowed'}
    } else return {status: 400, msg: 'group not found'}
    return {status: 200}
  }
}

module.exports = Permission
