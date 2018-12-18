const express = require('express');
const router = express.Router();
const passport= require('passport');
const bcrypt = require('bcrypt');

const db= require('../db');


//add route
router.get('/signup', function(req,res){
    res.render('signup', {
        title: 'sign up',
        errors:''
    });
    
});

router.post('/signup', function(req, res){
    req.checkBody('email','email hooson bj bolohgui').notEmpty();
    req.checkBody('email','email @ orson bna').isEmail();
    req.checkBody('password','hooson bj bolohgui').notEmpty();
    req.checkBody('password2','password taarahgui bn').equals(req.body.password);

    // get error
    let errors =req.validationErrors();

    if(errors){
        res.render('signup',{
            title: 'signup',
            errors:errors
        });
        console.log(errors);
    }else{
    let email= req.body.email;
    let password= req.body.password;
    let today= new Date();
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(password,salt,function(err, hash){
            if(err){
                console.log(err);
            }
            password=hash;
            db.query('INSERT INTO users (id,email,password,greated) VALUES(?,?,?,?)',['',email,password,today], 
            function(err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    req.flash('success','user added');
                    res.redirect('/users/login');
                }
            });
        });
    });
    

    }
});

router.get('/login', function(req,res){
    res.render('login', {
        title: 'login',
        errors:''
    });
    
});

router.post('/login', 
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash:true
    })
   
);


module.exports = router;