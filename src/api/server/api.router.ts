import { Router } from 'express'

const router = Router()

/**
 * @openapi
 * /api/checkhealth:
 *  get:
 *     tags:
 *     - Server
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get('/api/checkhealth', (_, res) => {
  res.status(200).json({ message: 'pong' })
})

export = {
  router
}
