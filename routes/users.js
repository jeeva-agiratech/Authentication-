const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')
// User model
const User = require ('../models/User');
//Login page
router.get('/login',(req,res) => res.render('login')) 
//register page
router.get('/register',(req,res) => res.render('register'))


//register handle
router.post('/register',(req,res) => {
    const {name, email, password, password2 } = req.body;
    // for validating the data things they entered
    let errors =[];

    //check required fields
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all feild'})
    }
    //check the password is match 
    if(password !== password2){
        errors.push({msg:'Password is Not matching'});
    }

//check password has 6 charcater
if(password.length <6){
    errors.push ({msg: 'Paasord should be at least 6 Character'})
}
if(errors.length > 0) {
   res.render('register',{
    errors,
    name,
    email,
    password,
    password2
   })
} else {
    //validation passed
  User.findOne({email: email})
  .then(user => {
    if(user) {
        //user exsists
        errors.push({msg : 'Email is Alredy Registerd'})
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
           });
    }else {
        const newUser = new User({
            name,
            email,
            password
        });
        // console.log(newUser)
        // res.send('hello')
        // hash password 
        bcrypt.genSalt(10,(err, salt) => 
        bcrypt.hash (newUser.password,salt,(err, hash)=>{
            if(err) throw err;
            //set password to hash
            newUser.password= hash;
            //save  user
            newUser.save()
             .then(user =>{
                req.flash('success_msg', 'Successfully Registered') //creating flash msg
                res.redirect('./login')
             })
             .catch(err => console.log(err));

        }))


    }
  })
}

})
//loin handle
router.post('/login',(req,res,next)=> {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: 'users/login',
    failureFlash: true
  

  })(req,res,next);
});

//Logout Handle
// router.get('/logout',(req,res) =>{
//    req.logout();
//    req.flash('success_msg', 'You are logged out');
//    res.redirect('/users/login');
// })
// Logout Handle
router.get('/logout', (req, res) => {
  req.logout(function(err) {
      if (err) {
          // Handle error, if any
          console.error(err);
      }
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
  });
});



module.exports = router; 