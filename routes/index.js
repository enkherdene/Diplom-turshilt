var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const db= require('../db');

router.get('/', function (req, res) {
    db.query("SELECT * FROM advertisement", function(err, rows){
        res.render('index', {
            title: 'articles',
            article: rows,
            errors:''
            
        });
    });
});

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
                    req.flash('danger','бүртгэлтэй цахим шуудан');
                    res.redirect('/signup');
                }else{
                    req.flash('success','амжилттай бүртгэлээ');
                    res.redirect('/login');
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

router.post('/login', function(req, res){
    let email= req.body.email;
    let password= req.body.password;
    
    db.query('SELECT * FROM users WHERE email=? ',[email],
    function(err,rows){
        if(err){
            console.log(err);
        }
         if(!rows){
            req.flash('danger','бүртгэлтэй цахим шуудан oldsongui');
            res.redirect('/login');
            return;
        }
        if(!bcrypt.compareSync(password, rows[0].password)){
            req.flash('danger','password buruu');
            res.redirect('/login');
            return;
        }
        if(req.body.remember){
            req.session.cookie.maxAge = 1000 * 60 * 3;
           }else{
            req.session.cookie.expires = false;
           }
        req.session.user=rows;
        req.flash('success','hi');
            res.redirect('/');


       
    });

});

router.get("/logout",function(req,res){    
	req.session.user = null;
	res.redirect("/");
});

module.exports = router;