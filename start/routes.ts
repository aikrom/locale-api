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

/**
 * Auth routes
 */
Route.group(() => {
  Route.post('sign-in', 'AuthController.signIn').as('sign-in')
  Route.post('sign-up', 'AuthController.signUp').as('sign-up')
  Route.post('logout', 'AuthController.logout').as('logout').middleware('auth')
})
  .as('auth')
  .prefix('auth')

/**
 * User password reset routes
 */
Route.group(() => {
  Route.post('forgot', 'PasswordResetController.forgot').as('forgot')
  Route.post('reset/:email', 'PasswordResetController.handShake').as('verify')
  Route.post('reset', 'PasswordResetController.reset').as('reset')
}).as('password-reset')

/**
 * User routes
 */
Route.group(() => {
  Route.post('me', 'UsersController.me').as('me')
})
  .as('users')
  .prefix('users')
  .middleware('auth')

/**
 * Common routes
 */
Route.group(() => {
  Route.get('languages', 'Common/LanguagesController.find').as('languages.find')
})
  .prefix('common')
  .as('common')

/**
 * Projects routes
 */
Route.group(() => {
  Route.get('/', 'ProjectsController.find').as('find')
  Route.get('/:id', 'ProjectsController.findById').as('find_by_id')
  Route.post('/', 'ProjectsController.create').as('create')
  Route.route('/:id', ['PUT', 'PATCH'], 'ProjectsController.update').as('update')
  Route.delete('/:id', 'ProjectsController.delete').as('delete')

  /**
   * Project collections routes
   */
  Route.group(() => {
    Route.get('/', 'CollectionsController.find').as('find')
    Route.get('/:id', 'CollectionsController.findById').as('find_by_id')
    Route.post('/', 'CollectionsController.create').as('create')
    Route.route('/:id', ['PUT', 'PATCH'], 'CollectionsController.update').as('update')
    Route.delete('/:id', 'CollectionsController.delete').as('delete')

    /**
     * Collection keys routes
     */
    Route.group(() => {
      Route.get('/', 'KeysController.find').as('find')
      Route.get('/:id', 'KeysController.findById').as('find_by_id')
      Route.post('/', 'KeysController.create').as('create')
      Route.route('/:id', ['PUT', 'PATCH'], 'KeysController.update').as('update')
      Route.delete('/:id', 'KeysController.delete').as('delete')

      /**
       * Key values routes
       */
      Route.group(() => {
        Route.get('/', 'KeyValuesController.find').as('find')
        Route.get('/:id', 'KeyValuesController.findById').as('find_by_id')
        Route.post('/', 'KeyValuesController.create').as('create')
        Route.route('/:id', ['PUT', 'PATCH'], 'KeyValuesController.update').as('update')
        Route.delete('/:id', 'KeyValuesController.delete').as('delete')
      })
        .prefix(':key_id/values')
        .as('values')
    })
      .prefix(':collection_id/keys')
      .as('keys')
  })
    .prefix(':project_id/collections')
    .as('collections')
})
  .prefix('projects')
  .as('projects')
  .middleware('auth')
  .where('id', Route.matchers.number())
  .where('project_id', Route.matchers.number())
  .where('collection_id', Route.matchers.number())
  .where('key_id', Route.matchers.number())
  .where('id', Route.matchers.number())
