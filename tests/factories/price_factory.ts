import Factory from '@adonisjs/lucid/factories'
import Price from '#models/price'
import { ProductFactory } from './product_factory.js'

export const PriceFactory = Factory.define(Price, async({ faker }) => {
  return {
    price: faker.number.float({ min: 0.01, max: 1000 }),
    currency: faker.helpers.arrayElement(['USD', 'BRL']),
  }
})
  .relation('product', () => ProductFactory)
  .build()