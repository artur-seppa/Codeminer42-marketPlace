import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import Stores from '#models/store'
import Address from '#models/address'
import { createStoreValidator } from '#validators/store';

export default class StoresController {
    async create({ request, response, auth }: HttpContext) {
        await auth.authenticate()

        if (!auth.user?.is_store_owner) {
            return response.unauthorized({ message: 'unauthorized account' })
        }

        const payload = await request.validateUsing(createStoreValidator);
        const trx = await Database.transaction();

        try {
            const existing = await Stores.query().where('name', payload.name).first();
            if (existing) {
                return response.badRequest({ message: 'store name already exists' });
            }

            const address = await Address.create(payload.address, { client: trx })

            const storeOwner = auth.user!
            const store = await Stores.create({
                name: payload.name,
                owner_id: storeOwner.id,
                category: payload.category,
                address_id: address.id,
            }, { client: trx })

            await trx.commit();

            await store.load('address')
            return response.created(store.serialize({
                fields: {
                    omit: ['id', 'addressId', 'createdAt', 'updatedAt'],
                },
                relations: {
                    address: {
                        fields: {
                            omit: ['id', 'createdAt', 'updatedAt'],
                        },
                    },
                },
            }));
        } catch (error) {
            await trx.rollback()
            return response.internalServerError({ message: error });
        }
    }
}