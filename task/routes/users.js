const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const dbService = require("../dbService");
const db = dbService.getDbServiceInstance();
const Joi = require("@hapi/joi");
const expressValidator = require('express-validator');
const api = express();
api.use(expressValidator())
const mysql = require("mysql");
const jwt = require('jsonwebtoken');
let instance = null;


const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "bms",
});

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
// router.post('/register', authController.register);
router.post('/register', function(req, res){
  console.log(req.body);
  
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser ={
      name:name,
      email:email,
      username:username,
      password:password
    };
    const result = db.newUserRegistration(newUser);
    result
    .then(data=> res.redirect('/users/login'))
    .catch((err)=>console.log(err)
    );
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Process
// router.post('/login', authController.login);
router.post('/login', function(req, res){
    var message = '';
    var sess = req.session; 
 
    var post  = req.body;
    var user = {
      username:post.username,
      password:post.password
    }
    try{
      console.log("user",user);
      
  if(!user.username || !user.password){
      console.log("Please provide username and password");
  }
  connection.query('SELECT * FROM USERS WHERE username = ?', [user.username], async(error, result)=>{
      if(!result || !(await bcrypt.compare(user.password,result[0].password))){
          res.status(400).render('login',{message:"The username or password is incorrect"});
      }
      console.log('Logged in');
      
      res.status(200).redirect('/bms');
  });

  }catch(err){
      console.log(err);
      
  }
    
    // const result = db.loginValidation(user,res);
    // result
    // .then(data=> res.redirect('/'))
    // .catch((err)=>console.log(err))           
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
