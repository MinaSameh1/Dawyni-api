import { get } from 'lodash'
import CartModel, { ItemModel, ItemInput, CartInput } from './cart.model'

export function getCart(uid: string) {
  return CartModel.find({ user_uid: uid }).populate({
    path: 'items.drugId',
    select: 'drugId drug_name price total'
  })
}

export function createItem(input: ItemInput) {
  return ItemModel.create(input)
}

export async function createPurchaseCart(input: CartInput) {
  // First create the items and add them to array
  const items = []
  for (const item of input.items) {
    items.push(await createItem(item))
  }
  // Then create the cart using the uid
  return CartModel.create({
    uid: get(input, 'user_uid'),
    items: items
  })
}
