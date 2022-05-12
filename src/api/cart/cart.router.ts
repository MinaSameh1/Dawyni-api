import { Router } from 'express'
import requireUser from '@App/middleware/requireUser'
import { GetUserCartHandler, GetAllCartsHandler } from './cart.controller'

export const router = Router()
const CART_ENDPOINT = '/api/cart'

router.get(CART_ENDPOINT, requireUser, GetUserCartHandler)

// Testing endpoint
router.get(CART_ENDPOINT + '/all', GetAllCartsHandler)

export default router
