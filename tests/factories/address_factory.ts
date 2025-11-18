import Factory from '@adonisjs/lucid/factories'
import Address from '#models/address'

export const AddressFactory = Factory.define(Address, ({ faker }) => {
  return {
      street: faker.location.street(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zip_code: faker.location.zipCode(),
      complement: faker.location.secondaryAddress(),
    }
}).build()