const mongoose = require('mongoose')
const config = require('config')
const bcrypt = require('bcrypt')
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true, min: 12 },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    gender: { type: String, required: true, default: 'male' },
    type: { type: Number, default: true },
    age: { type: Number, required: true }
  },
  { timestamps: true, versionKey: false }
)

UserSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(config.get('saltWorkFactor'))

  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model('user', UserSchema)
