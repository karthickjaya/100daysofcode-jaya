const express = require('express')
const path = require('path')
const mongoose=require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB=require('./config/db')

//Load Config
dotenv.config({ path: './config/config.env' })

//passport config
require('./config/passport')(passport)

//connect db
connectDB()

const app = express()

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars

app.engine(
    '.hbs',
    exphbs({
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )
  app.set('view engine', '.hbs')


//Static Folder
app.use(express.static(path.join(__dirname,'public')))

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:new MongoStore({mongooseConnection:mongoose.connection})
  }))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//routes
app.use('/', require('./routes/index'))
app.use('/auth',require('./routes/auth'))



const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${process.env.PORT}`)
)