var express = require('express');
var router = express.Router();

const db= require('../db');


//add route
router.get('/add', function(req,res){
    res.render('add', {
        title: 'Зар оруулах хүснэгт',
        article: req.body,
        errors:''
        
    });
    
});

router.post('/add', function(req, res){
    req.checkBody('title','Гарчиг хоосон байна').notEmpty();
    req.checkBody('auther','Нийтлэгч хоосон байна').notEmpty();
    //req.checkBody('body','body not null').notEmpty();

    // get error
    let errors =req.validationErrors();

    if(errors){
        res.render('add',{
            title: 'Зар оруулах хүснэгт',
            article: req.body,
            errors:errors
        });
        console.log(errors);
    }else{
    let title= req.body.title;
    let auther= req.body.auther;
    let body= req.body.body;
    db.query('INSERT INTO advertisement (id,title,auther,body) VALUES(?,?,?,?)',['',title,auther,body], 
    function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success','Зар бүртгэгдлээ');
            res.redirect('/');
        }
    });

    }
    
    return;
});

//get single ad
router.get('/:id', function(req,res){
    db.query("SELECT * FROM advertisement WHERE id= ?",[req.params.id], 
     function(err, rows){
         console.log(rows);
        res.render('article', {
            title: 'Зар',
            article: rows[0],
            errors:''
        });
     });
 });

 //edit article
router.get('/edit/:id', function(req,res){
    db.query("SELECT * FROM advertisement WHERE id= ?",[req.params.id], 
     function(err, rows){
         console.log(rows);
        res.render('edit_article', {
            title: 'Зарын мэдээлэл засах',
            article: rows[0],
            errors:''
        });
     });
 });

 router.post('/edit/:id', function(req, res){
    let title= req.body.title;
    let auther= req.body.auther;
    let body= req.body.body;
    db.query("UPDATE `advertisement` SET `title`= ?,`auther`= ?,`body`=? WHERE id=?",[title,auther,body,req.params.id], 
    function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success','Засагдлаа');
            res.redirect('/');
        }
    });

    console.log(req.body.title);
    return;
});

router.get('/delete/:id',function(req,res){
    db.query("DELETE FROM advertisement WHERE id= ?",[req.params.id], 
    function(err){
        if(err){
            console.log(err);
            return;
        }else{
            res.redirect('/');
        }
    });
});

module.exports = router;