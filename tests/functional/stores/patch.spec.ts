import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import { createAndLoginStoreOwner } from '#tests/util/login_store_owner'
import { StoreFactory } from '#tests/factories/store_factory'
import Store from '#models/store'
import Account from '#models/account'

test.group('Stores patch', (group) => {
  group.each.setup(async () => {
    await Store.query().delete()
    await Account.query().delete()
  })

  test('successfully updates store', async ({ client, assert }) => {
    const { token, account } = await createAndLoginStoreOwner(client)

    const store = await StoreFactory.with('address').merge({ owner_id: account.id }).create()

    const payload = {
      store_id: store.id,
      name: 'Updated Store Name',
      category: 'Updated Category',
      address: {
        street: 'Updated Street',
        city: 'Updated City',
        state: 'US',
        zip_code: '12345',
        complement: 'Updated Complement',
      },
    }

    const response = await client
      .patch('/stores')
      .header('Authorization', `Bearer ${token}`)
      .json(payload)

    response.assertStatus(200)

    const body = response.body()
    assert.equal(body.name, payload.name)
    assert.equal(body.category, payload.category)
    assert.equal(body.owner_id, account.id)
    assert.equal(body.address.street, payload.address.street)
    assert.equal(body.address.city, payload.address.city)
    assert.equal(body.address.state, payload.address.state)
    assert.equal(body.address.zip_code, payload.address.zip_code)
    assert.equal(body.address.complement, payload.address.complement)
  })

  test('fails to update a store that does not belong to the user', async ({ client, assert }) => {
    const { token } = await createAndLoginStoreOwner(client)
    const { account: otherAccount } = await createAndLoginStoreOwner(client)

    const store = await StoreFactory.with('address').merge({ owner_id: otherAccount.id }).create()

    const payload = {
      store_id: store.id,
      name: faker.company.name(),
    }

    const response = await client
      .patch('/stores')
      .header('Authorization', `Bearer ${token}`)
      .json(payload)

    response.assertStatus(404)
    assert.equal(response.body().message, 'store not found or unauthorized')
  })

  test('fails to update a non-existent store', async ({ client, assert }) => {
    const { token } = await createAndLoginStoreOwner(client)

    const payload = {
      store_id: 9999,
      name: 'Non-existent Store',
    }

    const response = await client
      .patch('/stores')
      .header('Authorization', `Bearer ${token}`)
      .json(payload)

    response.assertStatus(404)
    assert.equal(response.body().message, 'store not found or unauthorized')
  })
})