import { test } from '@japa/runner'

test.group('Accounts create', () => {
  test('create an account successfully with valid data', async ({ client, assert }) => {
    const response = await client.post('/accounts').json({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    response.assertStatus(201);
    
    const body = response.body()
    assert.exists(body.token)
    assert.equal(body.type, 'bearer')
    assert.include(body.abilities, '*')
    assert.exists(body.expiresAt)
  })

  test('responds with an error when attempting to create an account with invalid email', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: 'John Doe',
      email: 'test',
      password: '123456',
    })

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [
        {
          message: "The email field must be a valid email address",
          rule: "email",
          field: "email"
        }
      ]
    })
  })

  test('responds with an error when attempting to create an account with short password', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123',
    })

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [
        {
          message: "The password field must have at least 6 characters",
          rule: "minLength",
          field: "password",
          meta: {
            min: 6
          }
        }
      ]
    })
  })

  test('responds with an error when attempting to create an account with empty name', async ({ client }) => {
    const response = await client.post('/accounts').json({
      name: '',
      email: 'john@example.com',
      password: '123456',
    })

    response.assertStatus(422);
    response.assertBodyContains({
      errors: [
        {
          message: "The name field must be defined",
          rule: "required",
          field: "name"
        }
      ]
    });
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