import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import Stores from '#models/store'
import Address from '#models/address'
import { createStoreValidator, patchStoreValidator } from '#validators/store';

export default class StoresController {
    async create({ request, response, auth }: HttpContext) {
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
            return response.internalServerError({ message: 'internal server error' });
        }
    }

    async list({ response, auth }: HttpContext) {
        try {
            const storeOwner = auth.user!
            const stores = await Stores.query().where('owner_id', storeOwner.id);

            for (const store of stores) {
                await store.load('address')
            }

            const serializedStores = await Promise.all(stores.map(async (store) => {
                return store.serialize({
                    fields: {
                        omit: ['addressId', 'createdAt', 'updatedAt'],
                    },
                    relations: {
                        address: {
                            fields: {
                                omit: ['id', 'createdAt', 'updatedAt'],
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
        const trx = await Database.transaction();

        try {
            const storeOwner = auth.user!
            const store = await Stores.query()
                .where('id', payload.store_id)
                .where('owner_id', storeOwner.id)
                .first();

            if (!store) {
                return response.notFound({ message: 'store not found or unauthorized' });
            }

            if (payload.name) {
                const existing = await Stores.query()
                    .where('name', payload.name)
                    .whereNot('id', store.id)
                    .first();

                if (existing) {
                    return response.badRequest({ message: 'store name already exists' });
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
            await trx.commit();

            await store.load('address');
            return response.ok(store.serialize({
                fields: {
                    omit: ['addressId', 'createdAt', 'updatedAt'],
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
            await trx.rollback();
            return response.internalServerError({ message: 'internal server error' });
        }
    }

    async delete({ params, response, auth }: HttpContext) {
        try {
            const storeOwner = auth.user!
            const store_id = params.store_id;
            const store = await Stores.query().where('owner_id', storeOwner.id).andWhere('id', store_id).first();

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