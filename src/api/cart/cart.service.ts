import { FilterQuery, QueryOptions } from 'mongoose'
import { get } from 'lodash'
import CartModel, { Cart, ItemInput, CartInput } from './cart.model'

export function getCartHistory(uid: string) {
  return CartModel.find({ user_uid: uid, purchased: true })
    .populate({
      path: 'items.drugId',
      select: 'drugId drug_name price total'
    })
    .lean()
}

export function getCart(
  Query: FilterQuery<Cart>,
  options: QueryOptions = { lean: true }
) {
  return CartModel.find(Query, {}, options).populate({
    path: 'items.drugId',
    select: 'drugId drug_name price total'
  })
}

export function getOneCart(
  Query: FilterQuery<Cart>,
  options: QueryOptions = { lean: true }
) {
  return CartModel.findOne(Query, {}, options).populate({
    path: 'items.drugId',
    select: 'drugId drug_name quantity price total'
  })
}

export async function AddItemToCart(cartId: string, item: ItemInput) {
  // First get the cart
  const cart = await getOneCart({ _id: cartId }, {})
  if (cart) {
    // Check that it exists
    if (!cart.purchased) {
      // Check that its not purchased
      if (cart.items) {
        // Check that the item doesn't already exist!
        const index = cart.items.findIndex(item => item.drugId === item.drugId)
        if (index > -1) {
          // if it exists then increase quantity
          cart.items[index].quantity += item.quantity
          cart.items[index].total =
            cart.items[index].price * cart.items[index].quantity
        } else {
          cart.items.push(item) // Add it
        }
        cart.subTotal = cart.items
          .map(item => (item.total ? item.total : 0))
          .reduce((acc, next) => acc + next)
        return cart.save()
      }
    }
  }
}

export async function createPurchaseCart(input: CartInput) {
  // First create the items and add them to array
  const items = []
  let subTotal = 0
  for (const item of input.items) {
    items.push(item)
    subTotal += item.total
  }
  // Then create the cart using the uid
  return CartModel.create({
    user_uid: get(input, 'user_uid'),
    purchased: get(input, 'purchased', 'false'),
    items: items,
    subTotal: subTotal
  })
}

export async function purchaseCart(uid: string) {
  return CartModel.findOneAndUpdate(
    { user_uid: uid, purchased: false },
    { purchased: true }
  )
}

// For testing purposes only
export function getCarts() {
  return CartModel.find()
}

export async function removeItemFromCart({
  uid,
  drugId
}: {
  uid: string
  drugId: string
}) {
  // First get the cart
  const cart = await getOneCart({ user_uid: uid, purchased: false })
  if (cart) {
    if (cart.items) {
      cart.items = cart.items.filter(item => item.drugId !== drugId)
    }
    return cart.save()
  }
  return null
}
