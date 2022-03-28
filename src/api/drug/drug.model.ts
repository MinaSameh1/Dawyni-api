import { prop, getModelForClass } from '@typegoose/typegoose'

class form {
  @prop({ type: () => String })
  public form?: string
  @prop({ type: () => String })
  public image?: string
}

export class drug {
  @prop({ unique: true, required: true, type: () => [String] })
  public drug_name?: string

  @prop({ required: true, type: () => form })
  public forms?: form[]

  @prop({ required: true, type: () => String })
  public strength?: string

  @prop({ required: true, type: () => [String] })
  public active_ingredients?: Array<string>

  @prop({ required: true, type: () => String })
  public status?: string

  @prop({ required: true, type: () => String })
  public price?: number
}

const DrugModel = getModelForClass(drug)

export default DrugModel
