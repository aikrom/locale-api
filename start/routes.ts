/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('sign-in', 'Auth/AuthController.signIn').as('sign-in')
  Route.post('sign-up', 'Auth/AuthController.signUp').as('sign-up')
  Route.post('logout', 'Auth/AuthController.logout').as('logout').middleware('auth')
})
  .as('auth')
  .prefix('auth')

Route.group(() => {
  Route.post('me', 'Users/UsersController.me').as('me')
})
  .as('users')
  .prefix('users')
  .middleware('auth')

Route.group(() => {
  Route.get('languages', 'Common/LanguagesController.find').as('languages.find')
})
  .prefix('common')
  .as('common')

Route.group(() => {
  Route.get('/', 'Projects/ProjectsController.find').as('find')
  Route.get('/:id', 'Projects/ProjectsController.findById').as('find_by_id')
  Route.post('/', 'Projects/ProjectsController.create').as('create')
  Route.route('/:id', ['PUT', 'PATCH'], 'Projects/ProjectsController.update').as('update')
  Route.delete('/:id', 'Projects/ProjectsController.delete').as('delete')
})
  .prefix('users/projects')
  .as('users.projects')

Route.group(() => {
  Route.get('/', 'Collections/CollectionsController.find').as('find')
  Route.get('/:id', 'Collections/CollectionsController.findById').as('find_by_id')
  Route.post('/', 'Collections/CollectionsController.create').as('create')
  Route.route('/:id', ['PUT', 'PATCH'], 'Collections/CollectionsController.update').as('update')
  Route.delete('/:id', 'Collections/CollectionsController.delete').as('delete')
})
  .prefix('users/projects/:project_id/collections')
  .as('users.projects.collections')
