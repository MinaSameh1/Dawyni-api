const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    gender: { type: String, required: true, default: 'male' },
    type: { type: Boolean, required: true, default: 0 },
    age: { type: Number, required: true }
  },
  { timestamps: true, versionKey: false }
)

UserSchema.pre('save', async next => {
  let user = this
  if (!user.isModified('password')) return next()
  this.password = await bcrypt.hash(this.passwordj, 10)
})

module.exports = mongoose.model('user', UserSchema)
