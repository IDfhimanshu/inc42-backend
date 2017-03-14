/**
 * @author - Himanshu
 * User model represents all business logic of app, all backeend code should be writeen here
 */

"use strict"
//load modules
let db = require('../config/database.js');
let crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
//Export functions
module.exports = {
  /**
   * [signUp for user registration ]
   * @param  {[object]}   userData [user data]
   * @param  {Function} callback [callback function for user controller sign_up method]
   * @return {[object]}            [User information]
   */
  adminSignUp: function(userData,callback) {
    //generate user auth_token
    let auth_token = module.exports.generate_auth_token();
    userData.auth_token = auth_token;
    //base64 Encoding of password
    userData.password = module.exports.encrypt(userData.password);
    //insert user detain into databse
    db.query('INSERT INTO admin SET ?', userData, function(error,result) {
        if (!error) {
          let data = {
            id : result.insertId,
            name: userData.first_name,
            email : userData.email,
            auth_token: userData.auth_token
          };
          //callback to controllers
          callback(0, data);
        } else
        console.log(error);
        callback(error);
    });
  },
  createUser: function(userData,callback) {
    //generate user auth_token
    let auth_token = module.exports.generate_auth_token();
    userData.auth_token = auth_token;
    //base64 Encoding of password
    userData.password = module.exports.encrypt(userData.password);
    //insert user detain into databse
    db.query('INSERT INTO users SET ?', userData, function(error,result) {
        if (!error) {
          let data = {
            user_id : result.insertId,
            first_name:userData.first_name,
            email : userData.email,
            auth_token: userData.auth_token
          };
          //callback to controllers
          callback(0, data);
        } else
        callback(error);
    });
  },
  //function to get all purchase of user
  get_all_purchase: function(user_id, limit,offset, callback) {

    //get all users
    var data = {};
          db.query('select * FROM orders order by date_added DESC LIMIT '  + limit + ' OFFSET ' + offset, function(error,result) {
              if (!error) {
                data.orders = result;
                db.query('select count(*) as orderCount FROM orders' , function(error,rows) {
                    if (!error) {
                       data.count = rows[0].orderCount;
                      callback(0,data);
                    } else
                    callback(0,error);
                });
              } else
              callback(0,error);
          });
  },
  //funciton to cancel order
  cancelOrder: function(orderData, callback) {
    console.log(orderData.order_id);
              //if yes update product info
              db.query('UPDATE orders SET ? WHERE id = ?', [{ status:'cancelled'}, parseInt(orderData.order_id)], function(error,result) {
                  if (!error) {
                    callback(0, result);
                  } else
                  callback(error);
              });
  },
  //funciton to cancel order
  completeOrder: function(orderData, callback) {
    console.log(orderData.order_id);
              //if yes update product info
              db.query('UPDATE orders SET ? WHERE id = ?', [{ status:'completed'}, parseInt(orderData.order_id)], function(error,result) {
                  if (!error) {
                    callback(0, result);
                  } else
                  callback(error);
              });
  },
  /**
   * [login function to login user]
   * @param  {[object]}   userData [email , password]
   * @param  {Function} callback [contrller's sign_in method]
   * @return {[object]}            [User information]
   */
  login: function(userData,callback) {
    //get user's information
    userData.password = module.exports.encrypt(userData.password);
    db.query('select id, first_name, email, auth_token from admin where email = ? and password = ?', [userData.email, userData.password], function(error,result) {
        console.log(error);
        if (!error) {
          if(result.length > 0)
          callback(0, result);
          else {
            callback(0,false);
          }
        } else
        callback(error);
    });
  },
  /**
   * [generate_auth_token generate user's auth token]
   * @return {[auth_token]} [description]
   */
  generate_auth_token : function(){
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#$&'
    let result = '';
    for (let i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  },
  /**
   * function to check if email already exists
   * @return {[auth_token]} [description]
   */
  check_if_email_exists : function(email,callback){
    //get user's information
    db.query('select count(email) as emailCount from admin where email = ?', [email], function(error,result) {
        if (!error) {
          if(result[0].emailCount){
            callback(0, false);
          }else{
            callback(0,true);
            // response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
          }
        } else
        callback(error);
    });
  },
  //function to encrypt password
  encrypt : function(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
  },
 //function to decrypt password
   decrypt :function (text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }
};
