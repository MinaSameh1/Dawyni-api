import { Router } from 'express'
import requireUser from '../../middleware/requireUser'
import validateResource from '../../middleware/validateResource'
import {
  GetUserHistoryHandler,
  GetAllCartsHandler,
  GetUserCartHandler,
  PurchaseCartHandler,
  DeleteItemFromCartHandler,
  AddItemToCartHandler
} from './cart.controller'
import { cartItemSchema, deleteItemSchema } from './cart.schema'

export const router = Router()
const CART_ENDPOINT = '/api/cart'

// Testing endpoint
router.get(CART_ENDPOINT + '/all', GetAllCartsHandler)

router.get(CART_ENDPOINT + '/history', requireUser, GetUserHistoryHandler)

router.get(CART_ENDPOINT, requireUser, GetUserCartHandler)

router.patch(
  CART_ENDPOINT,
  requireUser,
  validateResource(cartItemSchema),
  AddItemToCartHandler
)

router.post(CART_ENDPOINT, requireUser, PurchaseCartHandler)

router.delete(
  CART_ENDPOINT + '/:drugId',
  requireUser,
  validateResource(deleteItemSchema),
  DeleteItemFromCartHandler
)

export default router
