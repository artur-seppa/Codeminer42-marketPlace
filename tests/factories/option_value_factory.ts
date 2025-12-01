import Factory from '@adonisjs/lucid/factories'
import OptionValue from '#models/option_value'
import { OptionFactory } from './option_factory.js'

export const OptionValueFactory = Factory.define(OptionValue, async ({ faker }) => {
    return {
        value: faker.company.name()
    }
})
    .relation('option', () => OptionFactory)
    .build()