import { Router } from 'express'
// import requireUser from '../../middleware/requireUser'
import validateResource from '../../middleware/validateResource'
import {
  getDrugsHandler,
  getDrugIdHandler,
  deleteDrugHandler,
  putDrugHandler,
  patchDrugHandler,
  getFormsHandler,
  createDrugHandler
} from './drug.controller'
import {
  deleteDrugSchema,
  patchDrugSchema,
  getDrugSchema,
  putDrugSchema,
  createDrugSchema
} from './drug.schema'

const router = Router()
const DRUG_ENDPOINT = '/api/drug'

/**
 * @openapi
 * '/api/drugs/{drugId}':
 *  get:
 *     tags:
 *     - Drugs
 *     summary: Get a single drug by the drugId
 *     parameters:
 *      - name: drugId
 *        in: path
 *        description: The id of the drug
 *        required: true
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *           schema:
 *              $ref: '#/components/schema/Drug'
 *       404:
 *         description: Drug not found
 */
router.put(
  `${DRUG_ENDPOINT}/:drugId`,
  [/* requireUser, */ validateResource(putDrugSchema)],
  putDrugHandler
)

router.post(
  DRUG_ENDPOINT,
  [/* requireUser, */ validateResource(createDrugSchema)],
  createDrugHandler
)

router.patch(
  `${DRUG_ENDPOINT}/:drugId`,
  [/* requireUser, */ validateResource(patchDrugSchema)],
  patchDrugHandler
)

router.get(DRUG_ENDPOINT, getDrugsHandler)
router.get(`${DRUG_ENDPOINT}/forms`, getFormsHandler)

router.get(
  `${DRUG_ENDPOINT}/:drugId`,
  validateResource(getDrugSchema),
  getDrugIdHandler
)

router.get(DRUG_ENDPOINT, getDrugsHandler)

router.delete(
  `${DRUG_ENDPOINT}/:drugId`,
  [/* requireUser, */ validateResource(deleteDrugSchema)],
  deleteDrugHandler
)

export = { router }
