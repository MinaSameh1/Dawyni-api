import { object, number, string, TypeOf, any } from 'zod'

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
 *         drug_name:
 *           type: string
 *         forms:
 *           type: "forms: [{ form: string, image: string }]"
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
  body: object({
    drug_name: string({
      required_error: 'drug_name is required'
    }),
    price: number({
      required_error: 'price is required'
    }),
    status: string({
      required_error: 'status is required'
    }),
    strength: string({
      required_error: 'strength is required'
    }),
    active_ingredients: any(),
    // active_ingredients: array(string()).nonempty({
    //   message: 'Active ingredients cannot be empty'
    // }),
    forms: any()
    // forms: array(object({ form: string(), image: string() })).nonempty({
    //   message: 'Forms cannot be empty'
    // })
  })
}

const params = {
  params: object({
    drugId: string({
      required_error: 'DrugID is required'
    })
  })
}

export const createDrugSchema = object({
  ...payload
})

export const putDrugSchema = object({
  ...payload,
  ...params
})

export const patchDrugSchema = object({
  ...params
})

export const deleteDrugSchema = object({
  ...params
})

export const getDrugSchema = object({
  ...params
})

export type CreateDrugInput = TypeOf<typeof createDrugSchema>
export type PutDrugInput = TypeOf<typeof putDrugSchema>
export type ReadDrugInput = TypeOf<typeof getDrugSchema>
export type DeleteDrugInput = TypeOf<typeof deleteDrugSchema>
