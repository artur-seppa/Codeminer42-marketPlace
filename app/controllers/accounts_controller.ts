import type { HttpContext } from '@adonisjs/core/http'
import Account from '#models/account'
import {
    createAccountValidator,
} from '#validators/account'

export default class AccountsController {
    async create({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createAccountValidator)

        try {
            const existing = await Account.query().where('email', payload.email).first()
            if (existing) {
                return response.badRequest({ message: 'Email already in use' })
            }

            const account = await Account.create(payload)
            return response.created(account)
        } catch (error) {
            return response.internalServerError({ message: 'internal server error' });
        } 

    }
}