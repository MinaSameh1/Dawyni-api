import { object, string, number, array } from 'zod'

const itemSchema = object({
  drugId: string({
    required_error: 'Drug id is needed'
  }),
  quantity: number({
    required_error: 'Drug quantity is required'
  }),
  price: number({
    required_error: 'Price is required'
  }),
  total: number({
    required_error: 'total is required!'
  })
})

export const cartItemSchema = object({
  body: itemSchema
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
