import { faker } from '@faker-js/faker'
import { AccountFactory } from '#tests/factories/account_factory'
import { ApiClient } from '@japa/api-client'

export async function createAndLoginStoreOwner(client: ApiClient) {
  const password = faker.internet.password({ length: 6 })
  const account = await AccountFactory.merge({ password: password }).create()

  const loginResponse = await client.post('/sessions').json({
    email: account.email,
    password,
  })

  const { token } = loginResponse.body()
  return { token, account }
}