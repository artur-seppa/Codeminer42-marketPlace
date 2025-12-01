import vine from '@vinejs/vine'

export const createStoreValidator = vine.compile(
  vine.object({
    name: vine.string().unique({ table: 'stores', column: 'name' }).trim().minLength(3),
    category: vine.string().trim(),
    address: vine.object({
      street: vine.string().trim().minLength(3),
      city: vine.string().trim().minLength(2),
      state: vine.string().trim().minLength(2),
      zip_code: vine.string().trim().minLength(5),
      complement: vine.string().trim().optional(),
    }),
  })
)

export const patchStoreValidator = vine.compile(
  vine.object({
    store_id: vine.number(),
    name: vine.string().trim().minLength(3).optional(),
    category: vine.string().trim().optional(),
    address: vine.object({
      street: vine.string().trim().minLength(3).optional(),
      city: vine.string().trim().minLength(2).optional(),
      state: vine.string().trim().minLength(2).optional(),
      zip_code: vine.string().trim().minLength(5).optional(),
      complement: vine.string().trim().optional(),
    }).optional(),
  })
)