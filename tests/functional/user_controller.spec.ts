import { test } from '@japa/runner'

test.group('Account controller', () => {
  test('create account', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: 'foo',
      email: 'test@example.com',
      password: '123456',
    })

    response.assertStatus(201)
    response.assertBodyContains({ email: 'test@example.com' })
  })
})