import { AccountFactory } from '#tests/factories/account_factory'
import { test } from '@japa/runner'
import { faker } from '@faker-js/faker'
import Account from '#models/account'

test.group('Sessions login', (group) => {
    group.each.setup(async () => {
        await Account.query().delete()
    })
    
    test('Login an account successfully with valid data', async ({ client, assert }) => {
        const password = faker.internet.password({ length: 6 })
        const account = await AccountFactory.merge({ password: password }).create()

        const response = await client.post('/sessions').json({
            email: account.email,
            password: password,
        })

        response.assertStatus(200);

        const body = response.body()
        assert.exists(body.token)
        assert.equal(body.type, 'bearer')
        assert.include(body.abilities, '*')
        assert.exists(body.expiresAt)
    })

    test('responds with an error when attempting to login an account with invalid input email', async ({ client }) => {
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

    test('responds with an error when attempting to login an account with invalid input password', async ({ client }) => {
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

    test('responds with an error when attempting to login an account with incorrect email', async ({ client }) => {
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

    test('responds with an error when attempting to login an account with incorrect password', async ({ client }) => {
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