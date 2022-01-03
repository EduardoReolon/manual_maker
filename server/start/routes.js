'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Helpers = use('Helpers')

Route.get('storage/:folder1/:folder2/:file', async ({ params: { folder1, folder2, file }, response }) => {
  response.download(Helpers.appRoot(`storage/${folder1}/${folder2}/${file}`))
})
Route.get('storage/:folder/:file', async ({ params: { folder, file }, response }) => {
  response.download(Helpers.appRoot(`storage/${folder}/${file}`))
})
Route.get('storage/:file', async ({ params: { file }, response }) => {
  response.download(Helpers.appRoot(`storage/${file}`))
})

Route.group(() => {
  Route.post('auth/login', 'UserController.login')
  Route.post('auth/register', 'UserController.register')
  Route.get('list/:group', 'ItemController.show')
  Route.get('list', 'ItemController.index')
  Route.get('content/:id', 'ContentController.show')
  Route.post('upload/:groupName', 'FileController.store')
})
  .prefix('api/')

Route.group(() => {
  Route.post('list', 'ItemController.store')
  Route.patch('content/:id', 'ContentController.update')
  Route.get('auth/me', 'UserController.me')
})
  .prefix('api/')
  .middleware('auth')

Route.any('*', async ({ params, response }) => {
  if (params[0].includes('openlink')) {
    const path = params[0].split('/');
    path.splice(0, path.indexOf('openlink') + 1);
    return response.download(Helpers.appRoot(`public/openlink/${path.join('/')}`));
  }
  return response.download(Helpers.appRoot('public/index.html'))
})
