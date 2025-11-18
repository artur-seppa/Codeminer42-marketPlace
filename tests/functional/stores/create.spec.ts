import Store from '#models/store'
import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Account from '#models/account'
import { createAndLoginStoreOwner } from '../../util/login_store_owner.js'

test.group('Stores create', (group) => {
  group.each.setup(async () => {
    await Store.query().delete()
    await Account.query().delete()
  })

  test('create a store successfully with valid data', async ({ client, assert }) => {
    const { token, account } = await createAndLoginStoreOwner(client)

    const storeData = {
      name: faker.company.name(),
      category: faker.commerce.department(),
      address: {
        street: faker.location.street(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip_code: faker.location.zipCode(),
        complement: faker.location.secondaryAddress(),
      }
    }

    const response = await client
      .post('/stores')
      .header('Authorization', `Bearer ${token}`)
      .json(storeData);

    response.assertStatus(201)

    const body = response.body()
    assert.equal(body.name, storeData.name)
    assert.equal(body.category, storeData.category)
    assert.equal(body.owner_id, account.id)
    assert.deepInclude(body.address, storeData.address)
  })

  test('responds with an error when attempting to create an store with repeted name', async ({ client }) => {
    const { token } = await createAndLoginStoreOwner(client)
    const storeName = faker.company.name();

    const storeData = {
      name: storeName,
      category: faker.commerce.department(),
      address: {
        street: faker.location.street(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip_code: faker.location.zipCode(),
        complement: faker.location.secondaryAddress(),
      }
    }

    await client
      .post('/stores')
      .header('Authorization', `Bearer ${token}`)
      .json(storeData);

    const storeRepetedData = {
      name: storeName,
      category: faker.commerce.department(),
      address: {
        street: faker.location.street(),
        city: faker.location.city(),
        state: faker.location.state({ abbreviated: true }),
        zip_code: faker.location.zipCode(),
        complement: faker.location.secondaryAddress(),
      }
    }

    const response = await client
      .post('/stores')
      .header('Authorization', `Bearer ${token}`)
      .json(storeRepetedData);

    response.assertStatus(400);
    response.assertBodyContains({
      message: "store name already exists"
    })
  })
})