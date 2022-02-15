var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

var indexRouter = require('./routes/index')
const bodyParser = require('body-parser')

// routes
const authRoute = require('./routes/auth.route')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// dotenv config and db connection
dotenv.config()
mongoose.connect(process.env.MONGO_URL, (err) => {
  if (err) throw err
})

app.use('/', indexRouter)
app.use('/', authRoute)

// catch 404 and forward to error handler
app.use((_, __, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

app.use

module.exports = app
