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
const ProductsController = () => import('#controllers/products_controller')

router.post('/accounts', [AccountsController, 'create']);
router.post('/sessions', [SessionsController, 'login']);

router.post('/stores', [StoresController, 'create']).use([middleware.auth()]);
router.get('/stores', [StoresController, 'list']).use([middleware.auth()]);
router.patch('/stores', [StoresController, 'patch']).use([middleware.auth()]);
router.delete('/stores/:store_id', [StoresController, 'delete']).use([middleware.auth()]);

router.post('/products', [ProductsController, 'create']).use([middleware.auth()]);
router.get('/products/:store_id/:status?', [ProductsController, 'list']);