import { Request, Response } from 'express'
import { get, toNumber } from 'lodash'
import { findDrug } from '../drug/drug.service'
import { ItemInput } from './cart.model'
import {
  getCartHistory,
  getCarts,
  getCart,
  AddItemToCart,
  getOneCart,
  purchaseCart,
  removeItemFromCart,
  createPurchaseCart
} from './cart.service'

export async function GetUserHistoryHandler(_: Request, res: Response) {
  const result = await getCartHistory(res.locals.user.uid)
  if (result) {
    return res.status(200).json({ result: result })
  }
  return res.status(400).json({ message: "The user didn't make any purchase" })
}

export async function GetUserCartHandler(_: Request, res: Response) {
  const result = await getCart({
    user_uid: res.locals.user.uid,
    purchased: false
  })
  if (result) {
    return res.status(200).json({ result: result })
  }
  return res.status(400).json({ message: "The user doesn't have any items" })
}

export async function GetAllCartsHandler(_: Request, res: Response) {
  return res.status(200).json({ result: await getCarts() })
}

export async function AddItemToCartHandler(
  req: Request<unknown, unknown, ItemInput>,
  res: Response
) {
  const cart = await getOneCart({
    user_uid: res.locals.user.uid,
    purchased: false
  })

  const drug = await findDrug({ _id: req.body.drugId })
  if (drug) {
    const item = {
      drugId: drug._id,
      quantity: get(req.body, 'quantity'),
      price: drug.price,
      total: drug.price * toNumber(get(req.body, 'quantity', 1))
    }
    if (cart) {
      const result = await AddItemToCart(cart._id, item)
      if (result) return res.status(200).json(result)
    } else {
      // create it
      const result = await createPurchaseCart({
        user_uid: res.locals.user.uid,
        purchased: false,
        items: [item]
      })
      if (result) return res.status(200).json(result)
      return res.status(400).json({ message: 'something went wrong' })
    }
    return res.status(400).json({ message: "Drug doesn't exist" })
  }
}

export async function PurchaseCartHandler(_: Request, res: Response) {
  const result = await purchaseCart(res.locals.user.uid)
  if (result) return res.status(200).json(result)
  return res
    .status(400)
    .json({ message: "User doesn't have cart to purchase!" })
}

export async function DeleteItemFromCartHandler(req: Request, res: Response) {
  const result = await removeItemFromCart({
    uid: res.locals.user.uid,
    drugId: get(req.body, 'drugId')
  })
  if (result) {
    return res.status(200).json({ message: 'Item deleted' })
  }
  return res.status(400).json({ message: "Item wasn't deleted, no cart?" })
}
