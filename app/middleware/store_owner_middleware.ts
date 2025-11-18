import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class StoreOwnerMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    if (!auth.user?.is_store_owner) {
      return response.unauthorized({ message: 'unauthorized account' })
    }

    await next();
  }
}