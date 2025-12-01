import Store from '#models/store'
import { test } from '@japa/runner'
import Account from '#models/account'
import { StoreFactory } from '#tests/factories/store_factory'
import { createAndLoginStoreOwner } from '#tests/util/login_store_owner'

test.group('Stores list', (group) => {
  group.each.setup(async () => {
    await Store.query().delete()
    await Account.query().delete()
  })

  test('list stores successfully', async ({ client, assert }) => {
    const { token, account } = await createAndLoginStoreOwner(client)

    const stores = await StoreFactory.with('address').merge({ owner_id: account.id }).createMany(3)

    const response = await client
      .get('/stores')
      .header('Authorization', `Bearer ${token}`);

    response.assertStatus(200)

    const body = response.body()

    assert.lengthOf(body, stores.length)
    stores.forEach((store, index) => {
      assert.equal(body[index].name, store.name)
      assert.equal(body[index].category, store.category)
      assert.equal(body[index].owner_id, account.id)
      assert.equal(body[index].address.street, store.address.street)
      assert.equal(body[index].address.city, store.address.city)
      assert.equal(body[index].address.state, store.address.state)
      assert.equal(body[index].address.zip_code, store.address.zip_code)
      assert.equal(body[index].address.complement, store.address.complement)
    })
  })

  test('responds with an error when attempting to search a store without the same owner token', async ({ client, assert }) => {
    const { token } = await createAndLoginStoreOwner(client)
    const { account: account_owner } = await createAndLoginStoreOwner(client)

    await StoreFactory.with('address').merge({ owner_id: account_owner.id }).create()

    const response = await client
      .get('/stores')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const body = response.body()

    assert.isArray(body)
    assert.isEmpty(body)
  })
})