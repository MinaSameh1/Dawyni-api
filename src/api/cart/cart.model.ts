import { getModelForClass, prop } from '@typegoose/typegoose'

export interface ItemInput {
  drugId: string
  drug_name: string
  image: string
  quantity: number
  price: number
  total: number
}

export interface CartInput {
  user_uid: string
  purchased: boolean
  items: [ItemInput]
}

export class Item {
  // @prop({ required: true, type: () => String })
  drugId?: string

  // @prop({ required: true, default: 1, type: () => Number })
  quantity = 1

  // @prop({ required: true, type: () => String })
  drug_name?: string

  // @prop({ required: true, type: () => String })
  image?: string

  // @prop({ required: true, type: () => Number })
  price = 1

  // @prop({ required: true, type: () => Number })
  total?: number
}

export class Cart {
  @prop({ required: true, type: () => String })
  user_uid?: string

  @prop({ required: true, type: () => Array })
  items?: Array<Item>

  @prop({ required: true, default: false, type: () => Boolean })
  purchased?: boolean

  @prop({ type: () => Number })
  subTotal?: number
}

const CartModel = getModelForClass(Cart, {
  schemaOptions: {
    versionKey: false,
    timestamps: true
  }
})

export default CartModel
