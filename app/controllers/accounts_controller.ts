import type { HttpContext } from '@adonisjs/core/http'
import Account from '#models/account'
import {
    createAccountValidator,
} from '#validators/account'

export default class AccountsController {
    async create({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createAccountValidator)

        try {
            const account = await Account.create(payload)
            return response.created(account);
        } catch (error) {
            throw error
        }
    }
}