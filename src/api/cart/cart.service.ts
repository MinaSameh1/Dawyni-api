import { FilterQuery, QueryOptions } from 'mongoose'
import { get } from 'lodash'
import CartModel, { Cart, ItemInput, CartInput } from './cart.model'

export function getCartHistory(uid: string) {
  return CartModel.find({ user_uid: uid, purchased: true }).lean()
}

export function getCart(
  Query: FilterQuery<Cart>,
  options: QueryOptions = { lean: true }
) {
  return CartModel.find(Query, {}, options)
}

export function getOneCart(
  Query: FilterQuery<Cart>,
  options: QueryOptions = { lean: true }
) {
  return CartModel.findOne(Query, {}, options)
}

export async function AddItemToCart(cartId: string, addedItem: ItemInput) {
  // First get the cart
  const cart = await getOneCart({ _id: cartId }, { lean: false })
  if (cart) {
    // Check that it exists
    if (!cart.purchased) {
      // Check that its not purchased
      // Check that the item doesn't already exist!
      const index = cart.items.findIndex(
        item => item.drugId === addedItem.drugId
      )
      if (index > -1) {
        // if it exists then increase quantity
        cart.items[index].quantity += addedItem.quantity
        cart.items[index].total =
          cart.items[index].price * cart.items[index].quantity
      } else {
        cart.items.push(addedItem) // Add it
      }
      return cart.save()
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
  const cart = await getOneCart(
    { user_uid: uid, purchased: false },
    { lean: false }
  )
  if (cart && cart?.items.length > 0) {
    cart.purchased = true
    return cart.save()
  }
  return null
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
  const cart = await getOneCart(
    { user_uid: uid, purchased: false },
    { lean: false }
  )
  if (cart) {
    if (cart.items) {
      if (cart.items.findIndex(item => item.drugId === drugId) > -1) {
        cart.items = cart.items.filter(item => item.drugId !== drugId)
        return cart.save()
      }
    }
  }
  return null
}
