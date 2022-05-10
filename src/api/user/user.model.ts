import { prop, getModelForClass, pre } from '@typegoose/typegoose'
import config from 'config'
import bcrypt from 'bcrypt'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

interface roles {
  role: 'user' | 'admin'
}

export interface UserInput {
  username?: string
  email?: string
  password?: string
  role?: roles
  dob?: string
  isMale?: boolean
  deviceToken?: string
}

export interface UserDocument extends UserInput {
  uid?: string
  createdAt?: Date
  updatedAt?: Date
  // comparePass(candidatePass: string): Promise<boolean>
}

@pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'))

  // hash pass
  if (this.password != null)
    this.password = bcrypt.hashSync(this.password, salt)
  else return

  return next()
})
export class User extends TimeStamps implements UserDocument {
  @prop({ unique: true, type: () => [String] })
  public uid?: string // FB user UID

  @prop({
    set: (val: string) => val.toLowerCase(),
    unique: true,
    required: true,
    type: () => [String]
  })
  public username?: string

  @prop({ unique: true, required: true, type: () => [String] })
  public email?: string

  @prop({ select: false, required: true, type: () => [String] })
  public password?: string

  @prop({ required: true, type: () => Date })
  public dob?: string

  @prop({ required: true, type: () => Boolean })
  public isMale?: boolean

  @prop({
    type: () => [String],
    default: () => 'user'
  })
  public role?: roles

  @prop({ required: false, type: () => String })
  public deviceToken?: string

  public async comparePass(candidatePass: string): Promise<boolean> {
    if (this.password != null)
      return bcrypt
        .compare(candidatePass, this.password)
        .catch((): false => false)
    else return false
  }
}

const UserModel = getModelForClass(User, {
  schemaOptions: {
    versionKey: false,
    timestamps: true
  }
})

export default UserModel
