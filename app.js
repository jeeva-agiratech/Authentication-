const express = require('express');  // geting express
const expressLayouts = require('express-ejs-layouts') ;// getting the express layoutes
const mongoose = require('mongoose')
const passport = require('passport');

const flash = require('connect-flash');
const session = require('express-session');




const app = express(); //initializing the app

//passport config
require('./config/passport')(passport);

//db config
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db,{useNewUrlParser: true})
 .then(() => console.log("MongoDb conected.."))
 .catch(err => console.log(err));

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}))


//Express Session
app.use(session ( {
    secret: 'secret',
    resave : true,
    saveUninitialized: true

}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables  // for colorfull msg
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

//routes - to get into the index file.
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('service started on port:5000'));