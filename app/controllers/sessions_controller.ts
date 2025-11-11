import type { HttpContext } from '@adonisjs/core/http'
import {
    createSessionValidator,
} from '#validators/session'
import hash from '@adonisjs/core/services/hash'
import Account from '#models/account'

export default class SessionsController {
    async login({ request, response }: HttpContext) {
        const payload = await request.validateUsing(createSessionValidator);

        try {
            const account = await Account.findBy('email', payload.email);

            if (!account) {
                return response.badRequest({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await hash.verify(account.password, payload.password);

            if (!isPasswordValid) {
                return response.badRequest({ message: 'Invalid credentials' });
            }

            const token = await Account.accessTokens.create(
                account, 
                ['*'],
                {
                    expiresIn: '1 day'
                }
            )

            return response.ok(token);
        } catch (error) {
            return response.internalServerError({ message: 'Internal server error' });
        }
    }
}