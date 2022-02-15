const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse({
      ...req.body,
      ...req.query,
      ...req.params
    })
    next()
  } catch (e) {
    return res.status(400).send(e.errors)
  }
}

module.exports = validateSchema
