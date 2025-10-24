import { AccountFactory } from '#tests/factories/account_factory'
import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'

test.group('Session login', () => {
    test('should login account successfully with valid data', async ({ client, assert }) => {
        const password = faker.internet.password({ length: 6 })
        const account = await AccountFactory.merge({ password: password }).create()

        const response = await client.post('/sessions').json({
            email: account.email,
            password: password,
        })

        response.assertStatus(200);

        const body = response.body()
        assert.exists(body.token)
        assert.isString(body.token)
        assert.equal(body.type, 'bearer')
        assert.isArray(body.abilities)
        assert.include(body.abilities, '*')
    })

    test('should not login account with invalid input email', async ({ client }) => {
        const response = await client.post('/sessions').json({
            email: "test",
            password: "password",
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

    test('should not login account with short input password', async ({ client }) => {
        const response = await client.post('/sessions').json({
            email: "john@example.com",
            password: "123",
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

    test('should not login account with incorrected email', async ({ client }) => {
        const password = faker.internet.password({ length: 6 })
        await AccountFactory.merge({ password: password }).create()

        const response = await client.post('/sessions').json({
            email: "test@gmail.com",
            password: password,
        })

        response.assertStatus(400);
        response.assertBodyContains({
            message: 'Invalid credentials'
        })
    })

    test('should not login account with incorrected password', async ({ client }) => {
        const password = faker.internet.password({ length: 6 })
        const account = await AccountFactory.merge({ password: password }).create()

        const response = await client.post('/sessions').json({
            email: account.email,
            password: faker.internet.password({ length: 9 }),
        })

        response.assertStatus(400);
        response.assertBodyContains({
            message: 'Invalid credentials'
        })
    })
})