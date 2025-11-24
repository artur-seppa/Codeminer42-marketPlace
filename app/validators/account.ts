import vine from '@vinejs/vine'

/**
 * Validates the account's creation action
 */
export const createAccountValidator = vine.compile(
    vine.object({
        name: vine
            .string()
            .trim(),
        email: vine.string().trim().email(),
        password: vine.string().minLength(6)
    })
)