/**
 * @author - Himanshu
 * authentication model responsible for all user related authentication.
 */

"use strict"
//load module
let db = require('../config/database.js');

//Export functions

module.exports = {
  /**
   * [api_authentication check for valid call for api using token]
   * @param  {[string]}   api_key  [api_token]
   * @param  {Function} callback [callback to function]
   * @return {[boolean]}            [true or false]
   */
  api_authentication: function(api_key,callback) {
    //check if header api_key is in database or not for security purpose
    db.query('SELECT * FROM api_auth WHERE api_token = ?', api_key, function(error,rows) {
        if (!error) {
          if(rows.length > 0){
            callback(0, true);
          }else{
            callback(0,false);
            // response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
          }
        } else
        callback(error);
    });
  },
  /**
   * [user_authentication for user authentication]
   * @param  {[Object]}   userData [user]
   * @param  {Function} callback [description]
   * @return {[boolean]}            [true or false]
   */
  user_authentication: function(userData,callback) {
    //get user's count having same id and auth_token
    db.query('select count(*) AS userCount from users where id = ? and auth_token = ?', [userData.user_id, userData.auth_token], function(error,rows) {
        if (!error) {
          if(rows[0].userCount){
            callback(0, true);
          }else{
            callback(0,false);
          }
        } else
        callback(error);
    });
  },
  /**
   * [admin_authentication checks if user is admin or not]
   * @param  {[int]}   user_id    [user_id]
   * @param  {[string]}   auth_token [auth_token]
   * @param  {Function} callback   [callback]
   * @return {[boolean]}              [true or false]
   */
  admin_authentication: function(data,callback) {
    db.query('select count(id) AS adminCount from admin where id = ? and auth_token = ?', [data.user_id, data.auth_token], function(error,rows) {
        if (!error) {
          if(rows[0].adminCount){
            callback(0, true);
          }else{
            callback(0,false);
          }
        } else
        callback(error);
    });
  },
      /**
        function for creating auth api
    */
    create_api_auth: function(data,callback) {
      console.log(data);
      //insert user detain into databse
      db.query('INSERT INTO api_auth SET ?', data, function(error,result) {
          if (!error) {
            //callback to controllers
            callback(0, result);
          } else
          callback(0,error);
      });
    }
};
