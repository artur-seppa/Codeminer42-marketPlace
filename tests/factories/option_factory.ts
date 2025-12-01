import Factory from '@adonisjs/lucid/factories'
import Option from '#models/option'
import { ProductFactory } from './product_factory.js'
import { OptionValueFactory } from './option_value_factory.js'

export const OptionFactory = Factory.define(Option, async ({ faker }) => {
    return {
        name: faker.company.name()
    }
})
    .relation('product', () => ProductFactory)
    .relation('optionValues', () => OptionValueFactory)
    .build()