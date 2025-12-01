import type { HttpContext } from '@adonisjs/core/http'
import Database from '@adonisjs/lucid/services/db'
import Store from '#models/store'
import Product from '#models/product'
import Price from '#models/price'
import Option from '#models/option'
import OptionValue from '#models/option_value'
import { createProductValidator } from '#validators/product'
import StoreException from '#exceptions/store_exception'

export default class ProductsController {
    async create({ request, response, auth }: HttpContext) {
        const payload = await request.validateUsing(createProductValidator)
        const storeOwner = auth.user!

        const result = await Database.transaction(async (trx) => {
            const store = await Store.query({ client: trx })
                .where('id', payload.store_id)
                .where('owner_id', storeOwner.id)
                .first();

            if (!store) {
                throw new StoreException('store not found or unauthorized', 404)
            }

            const product = await Product.create({
                name: payload.name,
                quantity: payload.quantity,
                category: payload.category,
                is_visible: payload.is_visible,
                store_id: payload.store_id,
            }, { client: trx })

            await Price.create({
                price: payload.price.price,
                currency: payload.price.currency,
                product_id: product.id,
            }, { client: trx })

            if (payload.options && payload.options.length > 0) {
                for (const opt of payload.options) {
                    const option = await Option.create({
                        name: opt.name,
                        product_id: product.id,
                    }, { client: trx })

                    if (opt.values && opt.values.length > 0) {
                        const valuesPayload = opt.values.map((v: string) => ({
                            value: v,
                            option_id: option.id,
                        }))
                        await OptionValue.createMany(valuesPayload, { client: trx })
                    }
                }
            }

            await product.load('prices')
            await product.load('options', (query) => query.preload('optionValues'))

            return product.serialize({
                fields: {
                    omit: ['createdAt', 'updatedAt'],
                },
                relations: {
                    prices: {
                        fields: {
                            omit: ['id', 'createdAt', 'updatedAt', 'product_id'],
                        },
                    },
                    options: {
                        fields: {
                            omit: ['id', 'createdAt', 'updatedAt', 'product_id'],
                        },
                        relations: {
                            values: {
                                fields: {
                                    omit: ['id', 'createdAt', 'updatedAt', 'option_id'],
                                },
                            },
                        },
                    },
                },
            });
        })

        return response.created(result);
    }

    async list({ response, params }: HttpContext) {
        try {
            const store_id = params.store_id;
            const status = typeof params.status === 'string' ? params.status.trim() : undefined

            const store = await Store.query()
                .where('id', store_id)
                .first();

            if (!store) {
                return response.notFound({ message: 'store not found' });
            }

            let isVisible: boolean | undefined
            if (status) {
                if (status === 'visible') isVisible = true
                else if (status === 'hidden') isVisible = false
            }

            const products = await Product.query()
                .where('store_id', store_id)
                .if(typeof isVisible !== 'undefined', (query) => {
                    query.where('is_visible', isVisible as boolean)
                })
                .preload('prices')
                .preload('options', (query) => query.preload('optionValues'));

            const serializedProducts = await Promise.all(products.map(async (product) => {
                return product.serialize({
                    fields: {
                        omit: ['createdAt', 'updatedAt'],
                    },
                    relations: {
                        prices: {
                            fields: {
                                omit: ['id', 'createdAt', 'updatedAt', 'product_id'],
                            },
                        },
                        options: {
                            fields: {
                                omit: ['id', 'createdAt', 'updatedAt', 'product_id'],
                            },
                            relations: {
                                values: {
                                    fields: {
                                        omit: ['id', 'createdAt', 'updatedAt', 'option_id'],
                                    },
                                },
                            },
                        },
                    },
                });
            }));

            return response.ok(serializedProducts);
        } catch (error) {
            return response.internalServerError({ message: 'internal server error' });
        }
    }
}