import Factory from '@adonisjs/lucid/factories'
import Store from '#models/store'
import { AddressFactory } from './address_factory.js'

export const StoreFactory = Factory.define(Store, async({ faker }) => {
  return {
    name: faker.company.name(),
    category: faker.word.words(1)
  }
})
  .relation('address', () => AddressFactory)
  .build()