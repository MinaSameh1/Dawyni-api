import { getModelForClass, prop } from '@typegoose/typegoose'

export interface ItemInput {
  drugId: string
  quantity: number
  price: number
  total: number
}

export interface CartInput {
  user_uid: string
  items: [ItemInput]
}

class Item {
  @prop({ required: true, type: () => String })
  drugId?: string

  @prop({ required: true, default: 1, type: () => Number })
  quantity?: number

  @prop({ required: true, type: () => Number })
  price?: number

  @prop({ required: true, type: () => Number })
  total?: number
}

export const ItemModel = getModelForClass(Item, {
  schemaOptions: {
    versionKey: false,
    timestamps: true
  }
})

class Cart {
  @prop({ required: true, type: () => String })
  user_uid?: string

  @prop({ required: true, type: () => [ItemModel] })
  items?: [typeof ItemModel]

  @prop({ required: true, default: false, type: () => Boolean })
  purchased?: boolean
}

const CartModel = getModelForClass(Cart, {
  schemaOptions: {
    versionKey: false,
    timestamps: true
  }
})

export default CartModel
