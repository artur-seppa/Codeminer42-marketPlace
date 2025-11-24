import Factory from '@adonisjs/lucid/factories'
import Account from '#models/account'

export const AccountFactory = Factory.define(Account, ({ faker }) => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 6 })
  }
}).build()