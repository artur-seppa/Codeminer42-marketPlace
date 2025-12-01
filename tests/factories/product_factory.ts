import Factory from '@adonisjs/lucid/factories'
import Product from '#models/product'
import { StoreFactory } from './store_factory.js'
import { PriceFactory } from './price_factory.js'
import { OptionFactory } from './option_factory.js'

export const ProductFactory = Factory.define(Product, async({ faker }) => {
  return {
    name: faker.company.name(),
    quantity: faker.number.int({ min: 1, max: 1000 }),
    is_visible: faker.datatype.boolean(),
    category: faker.word.words(1)
  }
})
  .relation('store', () => StoreFactory)
  .relation('prices', () => PriceFactory)
  .relation('options', () => OptionFactory)
  .build()