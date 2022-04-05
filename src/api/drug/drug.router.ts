import { Router } from 'express'
import requireUser from '../../middleware/requireUser'
import validateResource from '../../middleware/validateResource'
import {
  getDrugsHandler,
  deleteDrugHandler,
  updateDrugHandler,
  getFormsHandler
} from './drug.controller'
import {
  deleteDrugSchema,
  getDrugSchema,
  updateDrugSchema
} from './drug.schema'

const router = Router()
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
  '/api/drugs/:drugId',
  [requireUser, validateResource(updateDrugSchema)],
  updateDrugHandler
)

router.get('/api/drugs', getDrugsHandler)
router.get('/api/drugs/forms', getFormsHandler)

router.get(
  '/api/drugs/:drugId',
  validateResource(getDrugSchema),
  getDrugsHandler
)

router.get('/api/drugs/', getDrugsHandler)

router.delete(
  '/api/drugs/:drugId',
  [requireUser, validateResource(deleteDrugSchema)],
  deleteDrugHandler
)

export = { router }
