// Updates the form
var ops = []
db.drugs.find({ form: { $type: 2 } }).forEach((doc) => {
  var fr = doc.form
    .split(',')
    .map((e) => e.replace(/"|\[|\]|\\/gm, '').toString())

  ops.push({
    updateOne: { filter: { _id: doc._id }, update: { $set: { form: fr } } }
  })

  if (ops.length >= 1000) {
    db.drugs.bulkWrite(ops)
    ops = []
  }
})

// updates the strength
db.drugs.find({ strength: { $type: 2 } }).forEach((doc) => {
  var fr = doc.strength.replace(/"|\[|\]|\\/gm, '').toString()

  ops.push({
    updateOne: { filter: { _id: doc._id }, update: { $set: { strength: fr } } }
  })

  if (ops.length >= 1000) {
    db.drugs.bulkWrite(ops)
    ops = []
  }
})
