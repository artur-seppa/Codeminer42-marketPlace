import { test } from '@japa/runner'
import { createAndLoginStoreOwner } from '#tests/util/login_store_owner'
import { StoreFactory } from '#tests/factories/store_factory'
import Account from '#models/account'
import Store from '#models/store'

test.group('Stores delete', (group) => {
  group.each.setup(async () => {
    await Store.query().delete()
    await Account.query().delete()
  })

  test('successfully deletes a store', async ({ client, assert }) => {
    const { token, account } = await createAndLoginStoreOwner(client)

    const store = await StoreFactory.with('address').merge({ owner_id: account.id }).create()

    const response = await client
      .delete(`/stores/${store.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().message, 'store deleted successfully')

    const deletedStore = await Store.find(store.id)
    assert.isNull(deletedStore)
  })

  test('fails to delete a store that does not belong to the user', async ({ client, assert }) => {
    const { token } = await createAndLoginStoreOwner(client)
    const { account: otherAccount } = await createAndLoginStoreOwner(client)

    const store = await StoreFactory.with('address').merge({ owner_id: otherAccount.id }).create()

    const response = await client
      .delete(`/stores/${store.id}`)
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    assert.equal(response.body().message, 'store not found or unauthorized')

    const existingStore = await Store.find(store.id)
    assert.isNotNull(existingStore)
  })

  test('fails to delete a non-existent store', async ({ client, assert }) => {
    const { token } = await createAndLoginStoreOwner(client)

    const response = await client
      .delete('/stores/9999')
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(404)
    assert.equal(response.body().message, 'store not found or unauthorized')
  })
})