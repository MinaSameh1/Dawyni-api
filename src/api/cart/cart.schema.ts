import { object, string, optional, number, array } from 'zod'

const itemSchema = object({
  drugId: string({
    required_error: 'Drug id is needed'
  }),
  quantity: optional(
    number({
      required_error: 'Drug quantity is required'
    })
      .min(1, 'Cannot be negative!')
      .max(20, 'Cannot sell more than 20 quantities!')
  )
})

export const cartItemSchema = object({
  body: itemSchema
})

export const deleteItemSchema = object({
  param: object({
    drugId: string({
      required_error: 'Requires drugId'
    })
  })
})
export const cartItemsSchema = object({
  body: array(itemSchema)
})

export const cartSchema = object({
  body: object({
    user_uid: string({
      required_error: 'User uid must be supplied!'
    }),
    items: array(itemSchema)
  })
})
