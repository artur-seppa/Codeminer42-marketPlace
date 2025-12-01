import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import Store from '#models/store'
import Address from '#models/address'
import { createStoreValidator, patchStoreValidator } from '#validators/store';
import StoreException from '#exceptions/store_exception'

export default class StoresController {
    async create({ request, response, auth }: HttpContext) {
        const payload = await request.validateUsing(createStoreValidator);

        const result = await Database.transaction(async (trx) => {
            const storeOwner = auth.user!;
            const store = await Store.create({
                name: payload.name,
                owner_id: storeOwner.id,
                category: payload.category
            }, { client: trx });

            await Address.create({ ...payload.address, store_id: store.id }, { client: trx });

            await store.load('address');

            return store.serialize({
                fields: {
                    omit: ['createdAt', 'updatedAt'],
                },
                relations: {
                    address: {
                        fields: {
                            omit: ['id', 'createdAt', 'updatedAt', 'store_id'],
                        },
                    },
                },
            });
        });

        return response.created(result);

    }

    async list({ response, auth }: HttpContext) {
        try {
            const storeOwner = auth.user!
            const stores = await Store.query().where('owner_id', storeOwner.id);

            for (const store of stores) {
                await store.load('address')
            }

            const serializedStores = await Promise.all(stores.map(async (store) => {
                return store.serialize({
                    fields: {
                        omit: ['createdAt', 'updatedAt'],
                    },
                    relations: {
                        address: {
                            fields: {
                                omit: ['id', 'createdAt', 'updatedAt', 'store_id'],
                            },
                        },
                    },
                });
            }));

            return response.ok(serializedStores);
        } catch (error) {
            return response.internalServerError({ message: 'internal server error' });
        }
    }

    async patch({ request, response, auth }: HttpContext) {
        const payload = await request.validateUsing(patchStoreValidator);
        const storeOwner = auth.user!

        const result = await Database.transaction(async (trx) => {
            const store = await Store.query({ client: trx })
                .where('id', payload.store_id)
                .where('owner_id', storeOwner.id)
                .first();

            if (!store) {
                throw new StoreException('store not found or unauthorized', 404)
            }

            if (payload.name) {
                const existing = await Store.query({ client: trx })
                    .where('name', payload.name)
                    .whereNot('id', store.id)
                    .first();

                if (existing) {
                    throw new StoreException('store name already exists', 422)
                }
                store.name = payload.name;
            }

            if (payload.category) {
                store.category = payload.category;
            }

            if (payload.address) {
                await store.load('address');
                const address = store.address;

                if (payload.address.street) address.street = payload.address.street;
                if (payload.address.city) address.city = payload.address.city;
                if (payload.address.state) address.state = payload.address.state;
                if (payload.address.zip_code) address.zip_code = payload.address.zip_code;
                if (payload.address.complement) address.complement = payload.address.complement;

                await address.save();
            }

            await store.save();
            await store.load('address');

            return store.serialize({
                fields: {
                    omit: ['createdAt', 'updatedAt'],
                },
                relations: {
                    address: {
                        fields: {
                            omit: ['id', 'createdAt', 'updatedAt', 'store_id'],
                        },
                    },
                },
            });
        });

        return response.ok(result);
    }

    async delete({ params, response, auth }: HttpContext) {
        try {
            const storeOwner = auth.user!
            const store_id = params.store_id;
            const store = await Store.query().where('owner_id', storeOwner.id).andWhere('id', store_id).first();

            if (!store) {
                return response.notFound({ message: 'store not found or unauthorized' });
            }

            await store.delete();

            return response.ok({ message: 'store deleted successfully' });
        } catch (error) {
            return response.internalServerError({ message: 'internal server error' });
        }
    }
}