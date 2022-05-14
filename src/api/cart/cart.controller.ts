import logger from '../../utils/logger'
import { Request, Response } from 'express'
import { get, toNumber } from 'lodash'
import { findDrug } from '../drug/drug.service'
import { ItemInput } from './cart.model'
import {
  getCartHistory,
  getCarts,
  AddItemToCart,
  getOneCart,
  purchaseCart,
  removeItemFromCart,
  createPurchaseCart
} from './cart.service'

export async function GetUserHistoryHandler(_: Request, res: Response) {
  try {
    const result = await getCartHistory(res.locals.user.uid)
    if (result) {
      return res.status(200).json(result)
    }
    return res
      .status(204)
      .json({ message: "The user didn't make any purchase" })
  } catch (err: unknown) {
    logger.error(JSON.stringify(err, null, 2))
    return res.status(500).json({ message: 'Server side error' })
  }
}

export async function GetUserCartHandler(_: Request, res: Response) {
  try {
    const result = await getOneCart({
      user_uid: res.locals.user.uid,
      purchased: false
    })
    if (result) {
      return res.status(200).json(result)
    }

    const created = await createPurchaseCart({
      user_uid: res.locals.user.uid,
      purchased: false,
      items: []
    })
    return res.status(200).json(created)
  } catch (err) {
    logger.error(err)
    return res.status(500).json({ message: 'Something went wrong server side' })
  }
}

export async function GetAllCartsHandler(_: Request, res: Response) {
  return res.status(200).json(getCarts())
}

export async function AddItemToCartHandler(
  req: Request<unknown, unknown, ItemInput>,
  res: Response
) {
  try {
    const cart = await getOneCart({
      user_uid: res.locals.user.uid,
      purchased: false
    })

    logger.info('Currently in AddItemToCartHandler')
    const drug = await findDrug({ _id: req.body.drugId })
    if (drug) {
      const image = get(drug.forms?.at(0), 'image', '')
      const item = {
        drugId: drug._id,
        quantity: get(req.body, 'quantity'),
        drug_name: get(drug, 'drug_name', ''),
        image: image,
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
        return res.status(500).json({ message: 'something went wrong' })
      }
    }
    return res.status(400).json({ message: "Drug doesn't exist" })
  } catch (err: any) {
    logger.error({
      message: err.message,
      code: err.status,
      stack: err.stack || 'No stack'
    })
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
  try {
    const result = await removeItemFromCart({
      uid: res.locals.user.uid,
      drugId: get(req.body, 'drugId')
    })
    if (result) {
      return res.status(200).json({ message: 'Item deleted' })
    }
    return res.status(400).json({ message: "Item wasn't deleted" })
  } catch (err) {
    logger.error(err)
    return res
      .status(500)
      .json({ message: 'something went wrong server side ' })
  }
}
