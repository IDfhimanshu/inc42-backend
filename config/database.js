/**
 * database for connection with database
 */
"use strict"
// Retrive connection
const mysql = require('mysql');
//create connection object
//heroku my-sql cleardb credential set
let db_config = {
  connectionLimit : 10,
  host     : 'us-cdbr-iron-east-03.cleardb.net',
  user     : 'b9eb3f2df80f04',
  password : '27dc1a34',
  database : 'heroku_1453836360e5222'
  // host     : 'localhost',
  // user     : 'root',
  // password : 'mountain',
  // database : 'mykhana'
};
var connection;

function poolMysqlConnection() {
  connection = mysql.createPool(db_config); // Recreate the connection, since
//                                                   // the old one cannot be reused.
//   connection.connect(function(err) {              // The server is either down
//     if(err) {                                     // or restarting (takes a while sometimes).
//       console.log('error when connecting to db:', err);
//       setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//     }                                     // to avoid a hot loop, and to allow our node script to
//   });                                     // process asynchronous requests in the meantime.
//                                           // If you're also serving http, display a 503 error.
//   connection.on('error', function(err) {
//     console.log('connection built');
//     if(err.code === 'PROTOCOL_CONNECTION_LOST') {
//       console.log(err); // Connection to the MySQL server is usually
//       handleDisconnect();                         // lost due to either server restart, or a
//     } else {                                      // connnection idle timeout (the wait_timeout
//       throw err;                                  // server variable configures this)
//     }
//   });
 }

poolMysqlConnection();

//Function exports
module.exports = connection;
