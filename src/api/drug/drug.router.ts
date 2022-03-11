import { Router } from 'express'

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
// router.put(
//   "/api/drugs/:drugId",
//   [requireUser, validateResource(updateDrugSchema)],
//   updateDrugHandler
// );
//
// router.get(
//   "/api/drugs/:drugId",
//   validateResource(getDrugSchema),
//   getDrugHandler
// );
//
// router.delete(
//   "/api/drugs/:drugId",
//   [requireUser, validateResource(deleteDrugSchema)],
//   deleteDrugHandler
// );

export = { router }
