const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
//const db= require('./db');

const passport = require('passport');

const expressValidator = require('express-validator');
const flash= require('connect-flash');
const session = require('express-session');


var index= require('./routes/index');
var articles= require('./routes/articles');
var users= require('./routes/users');

//init app

const app= express();



//load view engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));


// body-parser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//set public folder

app.use(express.static(path.join(__dirname, 'public')));

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));
//express messages middleware

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator middleware
app.use(expressValidator({
     errorFormatter: function(param,msg,value){
         var namespace= param.split('.'),
         root= namespace.shift(),
         formParam =root;
         while(namespace.length){
             formParam +='['+namespace.shift() + ']';
         }
         return{
             param: formParam,
             msg: msg,
             value: value
         };

     }
}));
//Passport config
require('./config/passport')(passport);

//Passport midleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next){
    res.locals.user=req.user || null;
    next();
});
app.post('*', function(req,res,next){
    res.locals.user=req.user || null;
    next();
});

//home route
app.use('/',index);
app.use('/article',articles);
app.use('/users',users);

/**
//home route
app.get('/', function (req, res) {
    db.query("SELECT * FROM advertisement", function(err, rows){

        res.render('index', {
            title: 'articles',
            article: rows
        });
    });
});

//add route
app.get('/articles/add', function(req,res){
    res.render('add', {
        title: 'add articles'
        
    });
    
}); */

// Handlebars default config
/**const hbs = require('hbs');
const fs = require('fs');

const partialsDir = __dirname + '/views/partials';

const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  const name = matches[1];
  const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context, null, 2);
});
 */
//

// start server

app.listen(3000,function () {
    console.log('server started on port 3000...');
    
});