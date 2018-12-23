var express = require('express');
var router = express.Router();

const db= require('../db');
const Ad = require("../models/advertisement");
const User=require("../models/user");

//зар нэмэх
router.get('/add',ensureAuth, function(req,res){
    res.render('add', {
        title: 'Зар оруулах хүснэгт',
        article: req.body,
        errors:''
        
    });
    
});

router.post('/add', ensureAuth, function(req, res){
    req.checkBody('title','Гарчиг хоосон байна').notEmpty();
    //req.checkBody('auther','Нийтлэгч хоосон байна').notEmpty();
    //req.checkBody('body','body not null').notEmpty();
    
    // get error
    let errors =req.validationErrors();

    if(errors){
        res.render('add',{
            title: 'Зар оруулах хүснэгт',
            article: req.body,
            errors:errors
        });
        //console.log(errors);
    }else{
        User.findOne({
            where:{
                id:req.session.user.id
            }
        }).then(user=>{
            if(user){
                const adData = {
                    title: req.body.title,
                    auther: user.email,
                    body: req.body.body
                }
           
                Ad.create(adData)
                .then(ad => {
                    req.flash('success','Зар бүртгэгдлээ');
                    res.redirect('/');
                })
                .catch(err => {
                    console.log(err);
                    return;
                })
            }
        })
        .catch(err => {
            console.log(err);
            return;
        })

    }
    
    return;
});

//тухайн зарын мэдээлэл гаргах 
router.get('/:id', function(req,res){
    Ad.findOne({
        where:{
        id:req.params.id
        }
    }).then(ad=>{
        res.render('article', {
            title: 'Зар',
            article: ad,
            errors:''
        });
    })
    .catch(err => {
        res.send('error: ' + err)
    })
});

 //тухайн сонгосон зарын мэдээлэл засварлах
router.get('/edit/:id',ensureAuth, function(req,res){
    User.findOne({
        where:{
            id:req.session.user.id
        }
    }).then(user=>{
        if(user){
            Ad.findOne({
                where:{
                id:req.params.id
                }
            }).then(ad=>{
                if(user.email==ad.auther){
                    res.render('edit_article', {
                        title: 'Зарын мэдээлэл засах',
                        article: ad,
                        errors:''
                    });
                }else{
                    res.redirect('/article/'+ad.id);
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
 });

 router.post('/edit/:id',ensureAuth, function(req, res){
    let title= req.body.title;
    let auther= req.body.auther;
    let body= req.body.body;
    db.query("UPDATE `advertisements` SET `title`= ?,`auther`= ?,`body`=? WHERE id=?",[title,auther,body,req.params.id], 
    function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success','Засагдлаа');
            res.redirect('/');
        }
    });

   // console.log(req.body.title);
    return;
});

 //тухайн сонгосон зарын мэдээлэл устгах
router.get('/delete/:id',function(req,res){
    User.findOne({
        where:{
            id:req.session.user.id
        }
    }).then(user=>{
        if(user){
            Ad.findOne({
                where:{
                id:req.params.id
                }
            }).then(ad=>{
                if(user.email==ad.auther){
                    ad.destroy();
                    Ad.findAll().then(ads=>{
                        res.render('index', {
                            title: 'Зарын мэдээлэл',
                            article: ads,
                            errors:''
                            
                        });
                    });
                }else{
                    res.redirect('/article/'+ad.id);
                }
            })
            .catch(err => {
                res.send('error: ' + err)
            })
        }
    })
    .catch(err => {
        res.send('error: ' + err)
    })
    
});
 //хэрэглэгч нэвтэрсэн эсэх шалгах
function ensureAuth(req, res, next){
    if(req.session.user){
        return next();
    }else{
        req.flash('danger', 'Нэвтэрч орно уу');
        res.redirect('/login');
    }
}
module.exports = router;