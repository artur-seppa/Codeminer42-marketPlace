/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AccountsController = () => import('#controllers/accounts_controller')
const SessionsController = () => import('#controllers/sessions_controller')
const StoresController = () => import('#controllers/stores_controller')

router.post('/accounts', [AccountsController, 'create']);
router.post('/sessions', [SessionsController, 'login']);

router.post('/stores', [StoresController, 'create']);
