var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

const db= require('../db');
const User = require("../models/user");
const Ad = require("../models/advertisement");

//Нүүр хуудсанд зарын мэдээллүүд харуулах
router.get('/', function (req, res) {
    Ad.findAll().then(ads=>{
        res.render('index', {
            title: 'Зарын мэдээлэл',
            article: ads,
            errors:''
            
        });
    });
});

//бүртгэл
router.get('/signup', function(req,res){
    res.render('signup', {
        title: 'Бүртгэл',
        errors:''
    });
    
});

router.post('/signup', function(req, res){
    req.checkBody('email','Цахим шуудан шалгана уу').notEmpty();
    //req.checkBody('email','Цахим шуудан шалгана уу').isEmail();
    req.checkBody('password','Нууц үг шалгана уу').notEmpty();
    req.checkBody('password2','Нууц үг таарахгүй байна').equals(req.body.password);

    // get error
    let errors =req.validationErrors();

    if(errors){
        res.render('signup',{
            title: 'Бүртгэл',
            errors:errors
        });
        console.log(errors);
    }else{
        const today = new Date()
        const userData = {
            email: req.body.email,
            password: req.body.password,
            created: today
        }
        
        User.findOne({
            where: {
                email: req.body.email
            }
        })
            .then(user => {
                if (!user) {
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        userData.password = hash;
                        User.create(userData)
                            .then(user => {
                                res.json({ status: user.email + ' registered' })
                            })
                            .catch(err => {
                                res.send('error: ' + err)
                            })
                    })
                } else {
                    res.redirect('/login');
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
        
    

    }
});
//нэвтрэх
router.get('/login', function(req,res){
    res.render('login', {
        title: 'Нэвтрэх',
        errors:''
    });
    
});

router.post('/login', function(req, res){
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password,user.password) ) {
                    if(req.body.remember){
                        req.session.cookie.maxAge = 1000 * 60 * 3;
                       }else{
                        req.session.cookie.expires = false;
                       }
                    req.session.user=user;
                    res.redirect('/');
                }
            } else {
                res.status(400).json({ error: 'User does not exist' })
            }
        })
        .catch(err => {
            res.status(400).json({ error: err })
        })
        


       

});
//системээс гарах
router.get("/logout",function(req,res){    
	req.session.user = null;
	res.redirect("/");
});

//гарчигаар хайлт хийх
router.post("/search", function(req,res){
    db.query("SELECT * FROM advertisements WHERE INSTR(title, ?) > 0 ORDER BY auther",[req.body.search], function(err, rows){
        res.render('index', {
            title: 'Зарын мэдээлэл',
            article: rows,
            errors:''
            
        });
    });
   
})


module.exports = router;