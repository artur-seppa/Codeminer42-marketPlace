import { test } from '@japa/runner'

test.group('Accounts create', () => {
  test('create an account successfully with valid data', async ({ client }) => {
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

  test('responds with an error when attempting to create an account with invalid email', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: 'John Doe',
      email: 'test',
      password: '123456',
    })

    response.assertStatus(422)
  })

  test('responds with an error when attempting to create an account with short password', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123',
    })

    response.assertStatus(422)
  })

  test('responds with an error when attempting to create an account with empty name', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: '',
      email: 'john@example.com',
      password: '123456',
    })

    response.assertStatus(422)
  })

  test('responds with an error when attempting to create an account with a email', async ({ client }) => {
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