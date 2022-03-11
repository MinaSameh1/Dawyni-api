import { prop, getModelForClass, pre } from '@typegoose/typegoose'
import bcrypt from 'bcrypt'
import config from 'config'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'

interface roles {
  role: 'user' | 'admin'
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
class User extends TimeStamps {
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

  @prop({
    type: () => [String],
    default: () => 'user'
  })
  public role?: roles

  public async comparePass(candidatePass: string): Promise<boolean> {
    if (this.password != null)
      return bcrypt
        .compare(candidatePass, this.password)
        .catch((): false => false)
    else return false
  }
}

const UserModel = getModelForClass(User)

export default UserModel
