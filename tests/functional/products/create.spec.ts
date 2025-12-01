import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Store from '#models/store'
import Product from '#models/product'
import Account from '#models/account'
import { createAndLoginStoreOwner } from '../../util/login_store_owner.js'

test.group('Products create', (group) => {
  group.each.setup(async () => {
    await Product.query().delete()
    await Store.query().delete()
    await Account.query().delete()
  })

  test('create a product successfully with valid data', async ({ client, assert }) => {
    const { token, account } = await createAndLoginStoreOwner(client)

    const store = await Store.create({
      name: faker.company.name(),
      category: faker.commerce.department(),
      owner_id: account.id,
    })

    const productData = {
      name: faker.commerce.productName(),
      quantity: 10,
      category: faker.commerce.department(),
      is_visible: true,
      store_id: store.id,
      price: { price: 19.99, currency: 'USD' },
      options: [
        { name: 'Color', values: ['red', 'blue'] },
        { name: 'Size', values: ['S', 'M', 'L'] },
      ],
    }

    const response = await client
      .post('/products')
      .header('Authorization', `Bearer ${token}`)
      .json(productData)

    response.assertStatus(201)

    const body = response.body()
    assert.equal(body.name, productData.name)
    assert.equal(body.category, productData.category)
    assert.equal(body.store_id, store.id)
    assert.equal(body.quantity, productData.quantity)
    assert.equal(body.is_visible, productData.is_visible)

    assert.isArray(body.prices)
    assert.equal(body.prices[0].price, productData.price.price)
    assert.equal(body.prices[0].currency, productData.price.currency)

    assert.isArray(body.options)
    assert.equal(body.options.length, 2)
    assert.equal(body.options[0].name, 'Color')
    const optionValues = body.options[0].values.map((v: any) => v.value)
    assert.deepEqual(optionValues.sort(), ['blue', 'red'].sort())
  })
})