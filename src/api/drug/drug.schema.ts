import { object, string, TypeOf } from 'zod'

/**
 * @openapi
 * components:
 *   schema:
 *     Drug:
 *       type: object
 *       required:
 *        - name
 *        - forms
 *        - strength
 *        - active_ingredients
 *        - strength
 *        - status
 *        - price
 *       properties:
 *         name:
 *           type: string
 *         forms:
 *           type: { form: string, image: string }
 *         price:
 *           type: float
 *         image:
 *           type: multipart form Data
 *         status:
 *           type: string
 *         strength:
 *           type: string
 *         active_ingredients:
 *           type: array of string
 */

const payload = {
  body: object({})
}

const params = {
  params: object({
    productId: string({
      required_error: 'ProductId is required'
    })
  })
}

export const createDrugSchema = object({
  ...payload
})

export const updateDrugSchema = object({
  ...payload,
  ...params
})

export const deleteDrugSchema = object({
  ...params
})

export const getDrugSchema = object({
  ...params
})

export type CreateDrugInput = TypeOf<typeof createDrugSchema>
export type UpdateDrugInput = TypeOf<typeof updateDrugSchema>
export type ReadDrugInput = TypeOf<typeof getDrugSchema>
export type DeleteDrugInput = TypeOf<typeof deleteDrugSchema>
