var express = require('express');
var router = express.Router();

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


module.exports = router;