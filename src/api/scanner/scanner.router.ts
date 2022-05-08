import { Router } from 'express'
import multer from 'multer'
import { scannerPostHandler } from './scanner.controller'

export const router = Router()

router.post('/api/scanner', multer().single('img'), scannerPostHandler)

export default router
