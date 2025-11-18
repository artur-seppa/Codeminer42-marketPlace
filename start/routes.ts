/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const AccountsController = () => import('#controllers/accounts_controller')
const SessionsController = () => import('#controllers/sessions_controller')
const StoresController = () => import('#controllers/stores_controller')

router.post('/accounts', [AccountsController, 'create']);
router.post('/sessions', [SessionsController, 'login']);

router.post('/stores', [StoresController, 'create']).use([middleware.auth(), middleware.authStoreOwner()]);
router.get('/stores', [StoresController, 'list']).use([middleware.auth(), middleware.authStoreOwner()]);
router.patch('/stores', [StoresController, 'patch']).use([middleware.auth(), middleware.authStoreOwner()]);
router.delete('/stores/:store_id', [StoresController, 'delete']).use([middleware.auth(), middleware.authStoreOwner()]);