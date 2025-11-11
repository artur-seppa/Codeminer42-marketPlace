import vine from '@vinejs/vine'

/**
 * Validates the account's creation action
 */
export const createStoreValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(3),
    category: vine.string(),
    address: vine.object({
      street: vine.string().minLength(3),
      city: vine.string().minLength(2),
      state: vine.string().minLength(2),
      zip_code: vine.string().minLength(5),
      complement: vine.string().optional(),
    }),
  })
)