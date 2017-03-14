/**
 * @author - Himanshu
 * User model represents all business logic of app, all backeend code should be writeen here
 */

"use strict"
//load modules
let db = require('../config/database.js');
let admin = require('../models/admin.js');

//Export functions
module.exports = {
  /**
   * [signUp for user registration ]
   * @param  {[object]}   userData [user data]
   * @param  {Function} callback [callback function for user controller sign_up method]
   * @return {[object]}            [User information]
   */
  signUp: function(userData,callback) {
    //generate user auth_token
    let auth_token = module.exports.generate_auth_token();
    userData.auth_token = auth_token;
    //base64 Encoding of password
    userData.password = admin.encrypt(userData.password);
    //insert user detain into databse
    db.query('INSERT INTO users SET ?', userData, function(error,result) {
        if (!error) {
          let data = {
            id : result.insertId,
            first_name:userData.first_name,
            email : userData.email,
            profile_url : userData.profile_url,
            auth_token: userData.auth_token
          };
          //callback to controllers
          callback(0, data);
        } else
        callback(error);
    });
  },
    /**
     * [signUp for user registration ]
     * @param  {[object]}   userData [user data]
     * @param  {Function} callback [callback function for user controller sign_up method]
     * @return {[object]}            [User information]
     */
  createOrder: function(orderdata,callback) {
    let product_stock = orderdata.product_stock
    delete orderdata.product_stock;
    db.query('INSERT INTO orders SET ?', orderdata, function(error,result) {
        if (!error) {
        console.log(error);
          let data = {
            id : result.insertId,
            price:orderdata.price
          };
          db.query('UPDATE products Set ? WHERE id = ?', [{ product_stock:product_stock }, orderdata.product_id], function(error,result) {
            console.log(error);
            if (!error) {
              //callback
              callback(0, data);
            } else
            callback(error);
          });
        }
    });
  },
  /**
   * [deleteUser function to delete a user]
   * @param  {[int]}   user_id    [user_id]
   * @param  {[int]}   product_id [product_id]
   * @param  {Function} callback   [callback function]
   * @return {[JSON]}              [object]
   */
  deleteUser: function(user_id, callback) {
    //check for valid user of this product
      db.query('UPDATE users Set ? WHERE id = ?', [{ active:0 }, user_id], function(error,result) {
          if (!error) {
            //callback
            callback(0, true);
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
    userData.password = admin.encrypt(userData.password);
    db.query('select id, first_name, email, auth_token, profile_url from users where email = ? and password = ?', [userData.email, userData.password], function(error,result) {
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
   * [get_all_users function to get all users based on query string]
   * @param  {[int]}   limit,offset [description]
   * @param  {Function} callback     [description]
   * @return {[JSON]}                [description]
   */
  get_all_users: function(limit,offset, callback) {
    //get all users
    var data = {};
          db.query('select id,first_name, last_name, email,date_added FROM users where active = 1 order by date_added DESC LIMIT '  + limit + ' OFFSET ' + offset, function(error,result) {
              if (!error) {
                data.users = result
                db.query('select count(id) as userCount FROM users', function(error,rows) {
                    if (!error) {
                       data.count = rows[0].userCount;
                      callback(0,data);
                    } else
                    callback(0,error);
                });
              } else
              callback(0,error);
          });
  },
  //function to get all purchase of user
  get_all_purchase: function(user_id, limit,offset, callback) {
    //get all users
    var data = {};
          db.query('select * FROM orders where user_id = ' + user_id + ' order by date_added DESC LIMIT '  + limit + ' OFFSET ' + offset, function(error,result) {
              if (!error) {
                data.orders = result;
                db.query('select count(*) as orderCount FROM orders where user_id = ' + user_id , function(error,rows) {
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
  /**
   * [updateProduct function to update a function ]
   * @param  {[type]}   product  [object]
   * @param  {Function} callback [description]
   * @return {[json]}            [description]
   */
  updateUser: function(user, callback) {
              //if yes update product info
              db.query('UPDATE users SET ? WHERE id = ?', [{ first_name:user.first_name , last_name : user.last_name,mobile : user.mobile, email:user.email}, user.id], function(error,result) {
                  if (!error) {
                    callback(0, result);
                  } else
                  callback(error);
              });
  },
  /**
   * [get_user function to get  users detail based on id]
   * @param  {[int]}   int [description]
   * @param  {Function} callback     [description]
   * @return {[JSON]}                [description]
   */
  get_user: function(user_id, callback) {
          db.query('select id,first_name,last_name,password,email,date_added,mobile FROM users where id = '  + user_id, function(error,result) {
              if (!error) {
                  result[0].password = admin.decrypt(result[0].password);
                  callback(0,result);
              } else
              callback(0,error);
          });
  },
  /**
   * function to check if email already exists
   * @return {[auth_token]} [description]
   */
  check_if_email_exists : function(email,callback){
    //get user's information
    db.query('select count(email) as emailCount from users where email = ?', [email], function(error,result) {
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
  /**
   * [generate_auth_token generate user's auth token]
   * @return {[auth_token]} [description]
   */
  generate_auth_token : function(){
    let chars = '0123456789abcdefghijklmnopqrstuvwx@yzABCDEFGHIJKLMNOPQRSTUVWXYZ-'
    let result = '';
    for (let i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
};
