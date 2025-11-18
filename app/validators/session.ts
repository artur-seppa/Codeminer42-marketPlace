import vine from '@vinejs/vine'

export const createSessionValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        password: vine.string().minLength(6)
    })
)