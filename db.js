const mysql =require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'diplom_neg'
  });
   
 connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

/**connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
  
}); */

module.exports = connection;

