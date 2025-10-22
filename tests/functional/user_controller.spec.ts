import { test } from '@japa/runner'

test.group('Account creation', () => {
  test('should create an account successfully with valid data', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    response.assertStatus(201)
    response.assertBodyContains({ 
      email: 'john@example.com',
      name: 'John Doe'
    })
  })

  test('should not create account with invalid email', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: 'John Doe',
      email: 'test',
      password: '123456',
    })

    response.assertStatus(422)
  })

  test('should not create account with short password', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123',
    })

    response.assertStatus(422)
  })

  test('should not create account with empty name', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: '',
      email: 'john@example.com',
      password: '123456',
    })

    response.assertStatus(422)
  })

  test('should not allow duplicate email', async ({ client }) => {
    await client.post('/accounts').json({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const response = await client.post('/accounts').json({
      name: 'Jane Doe',
      email: 'john@example.com',
      password: '123456',
    })

    response.assertStatus(400);
    response.assertBodyContains({ 
      message: 'Email already in use'
    })
  })
})