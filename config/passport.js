const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mysql =require('mysql');
/**var dbconfig = require('./database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database); */
const db= require('../db');
module.exports=function(passport){
   
    passport.use(
        'local',
        new LocalStrategy({
         usernameField : 'email',
         passwordField: 'password',
         passReqToCallback: true
        },
        function(req, email, password, done){
         db.query("SELECT * FROM users WHERE email = ? ", [email],
         function(err, rows){
          if(err){
          //console.log(err);
           return done(err);
          }
          if(!rows.length){
           return done(null, false, {message:'user not found'});
          }
          if(!bcrypt.compareSync(password, rows[0].password))
           return done(null, false,  {message:'password taarsangui'});
          console.log(rows);
          return done(null, rows[0]);
         });
        })
       );
     passport.serializeUser(function(user, done){
        done(null, user.id);
       });
      
    passport.deserializeUser(function(id, done){
        db.query("SELECT * FROM user WHERE id = ? ", [id],
         function(err, rows){
          done(err, rows[0]);
         });
    });

    
}