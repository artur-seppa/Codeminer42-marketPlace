import { test } from '@japa/runner'
import Account from '#models/account'
import Store from '#models/store'
import Product from '#models/product'
import { ProductFactory } from '#tests/factories/product_factory'
import { createAndLoginStoreOwner } from '#tests/util/login_store_owner'
import { StoreFactory } from '#tests/factories/store_factory'

test.group('Products list', (group) => {
  group.each.setup(async () => {
    await Product.query().delete()
    await Store.query().delete()
    await Account.query().delete()
  })

  test('list products successfully for the store owner', async ({ client, assert }) => {
    const { account } = await createAndLoginStoreOwner(client)

    const store = await StoreFactory.with('address').merge({ owner_id: account.id }).create()
    
    const products = await ProductFactory.with('prices').with('options').merge({ store_id: store.id }).createMany(3)

    const response = await client
      .get(`/products/${store.id}`)

    response.assertStatus(200)
    const body = response.body()

    assert.lengthOf(body, products.length)
    products.forEach((product, index) => {
      assert.equal(body[index].name, product.name)
      assert.equal(body[index].quantity, product.quantity)
      assert.equal(body[index].category, product.category)
      assert.equal(body[index].is_visible, product.is_visible)
      assert.equal(body[index].store_id, store.id)
      assert.equal(body[index].prices[0].price, product.prices[0].price.toFixed(2))
      assert.equal(body[index].prices[0].currency, product.prices[0].currency)
    })
  })

  test('list successfully only visible products when the status is iqual to visible', async ({ client, assert }) => {
    const { account } = await createAndLoginStoreOwner(client)

    const store = await StoreFactory.with('address').merge({ owner_id: account.id }).create()

    await ProductFactory.with('prices').merge({ store_id: store.id, is_visible: true }).createMany(2)
    await ProductFactory.with('prices').merge({ store_id: store.id, is_visible: false }).create()

    const response = await client.get(`/products/${store.id}/visible`)
    
    response.assertStatus(200)
    const body = response.body()
    
    assert.lengthOf(body, 2)
    body.forEach((p: any) => assert.equal(p.is_visible, true))
  })

  test('list successfully only hidden products when the status is equal to hidden', async ({ client, assert }) => {
    const { account } = await createAndLoginStoreOwner(client)

    const store = await StoreFactory.with('address').merge({ owner_id: account.id }).create()

    await ProductFactory.with('prices').merge({ store_id: store.id, is_visible: true }).createMany(2)
    await ProductFactory.with('prices').merge({ store_id: store.id, is_visible: false }).create()

    const response = await client.get(`/products/${store.id}/hidden`)
    response.assertStatus(200)

    const body = response.body()
    assert.lengthOf(body, 1)

    body.forEach((p: any) => assert.equal(p.is_visible, false))
  })

  test('fails to list de products from a non existent store', async ({ client, assert }) => {
    const response = await client
      .get('/products/9999')

    response.assertStatus(404)
    assert.equal(response.body().message, 'store not found')
  })
})