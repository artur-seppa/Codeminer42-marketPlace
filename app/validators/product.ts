import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    quantity: vine.number().min(1),
    category: vine.string().trim(),
    is_visible: vine.boolean(),
    store_id: vine.number(),
    price: vine.object({
        price: vine.number().min(0).max(9999999.99),
        currency: vine.enum(['BRL', 'USD'])
    }),
    options: vine.array(
      vine.object({
        name: vine.string().trim().minLength(1),
        values: vine.array(vine.string().trim().minLength(1)),
      })
    ).optional(),
  })
)