/*
    @author - Himanshu
    User controller responsible to get the business login from models
     and send appropriate response to end user
 */

"use strict"
//include all modules
let users = require('../models/users.js');
let apiAuth = require('../models/authentication.js');

// Export functions
module.exports = function(response) {
    return {
        home: function() {
            response.end(JSON.stringify({"status":200,"success":true,"message":"Hello World"}));
        },
      /**
       * [user registartion function based on their role]
       * @param  {[object]} postData [user data (email, password, user_role - admin or user)]
       * @param  {[string]} api_key  [api authentication key]
       * @return {[object]}          [json success/failure object]
       */
        sign_up: function(postData,api_key) {
          console.log(postData.password);
            if(postData.email != undefined && postData.email != null && postData.password != undefined && postData.password != null){
          //check for valid api authentication
                  apiAuth.api_authentication(api_key, function(err, result) {
                    if (err) {
                        //Database error
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      //if api authentication failed return false message
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //if api authentication sucess process to user sign up
                          users.signUp(postData, function(err, result) {
                            //send success response in case success registration
                            //@return user_id, auth_token and user email
                            console.log(err + "resut" + result);
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Email id already exists"}));
                            } else {
                                response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                            }
                        });
                      }
                    }
                });
              }else{
                response.end(JSON.stringify({"status":202,"success":false,"message":"Invalid parameters"}));
              }
        },
        /**
         * [sign_in function to sign in user in this platform]
         * @param  {[object]} userData [user email and password]
         * @param  {[string]} api_key  [api_key]
         * @return {[object]}          [Json object]
         */
        sign_in: function(userData,api_key) {
          if(userData.email == undefined || userData.email == null || userData.password || null || userData.password == undefined){
          //check for valid api authentication
                  apiAuth.api_authentication(api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //if api_key is valid and no serevr error process to login
                        users.login(userData, function(err, result) {
                          if (err) {
                              response.end(JSON.stringify({"status":203,"success":false,"message":"Invalid server error"}));
                          } else {
                              if(result !== false)
                              response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                              else {
                                response.end(JSON.stringify({"status":203,"success":false,"message":"Invalid Login Details"}));
                              }
                          }
                      });
                      }
                    }
                });
              }else{
                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
              }
        },
        /**
         * [get_user function to get individual user  detail]
         * @param  {[object]} headers      [description]
         * @param  {[user_id]} user_id [description]
         * @return {[Json]}              [Product object]
         */
        get_user: function(headers,user_id) {
          //check for valid api authentication
                  apiAuth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                          apiAuth.admin_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"admin not authorized"}));
                              }else{
                                //search all product having same query string
                                  users.get_user(user_id, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                        //let product = [];
                                        response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        get_user_info: function(headers,user_id) {
          //check for valid api authentication
                  apiAuth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                          apiAuth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"admin not authorized"}));
                              }else{
                                //search all product having same query string
                                  users.get_user(user_id, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                        //let product = [];
                                        response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [delete_user function to delete a user, only admin can delete]
         * @param  {[object]} headers    [user headers]
         * @param  {[int]} user_id [product_id]
         * @return {[object]}            [success or failure]
         */
        delete_user: function(headers, user_id) {
          //check for valid api authentication
                  apiAuth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //check for admin authentication
                          apiAuth.admin_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"user not authorized"}));
                              }else{
                                  users.deleteUser(user_id, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                      if(result === true){
                                        response.end(JSON.stringify({"status":200,"success":true,"message":"user deleted successfully"}));
                                      }else{
                                        response.end(JSON.stringify({"status":201,"success":false,"message":"No Such Such exists for user"}));
                                      }
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [search_product function to search product on basis of query staring]
         * @param  {[object]} headers      [description]
         * @param  {[string]} search_query [description]
         * @return {[Json]}              [Product object]
         */
        get_all_users: function(headers,limit,offset) {
          //check for valid api authentication
                  apiAuth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                          apiAuth.admin_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"admin not authorized"}));
                              }else{
                                //search all product having same query string
                                  users.get_all_users(limit,offset, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                        //let product = [];
                                        response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [get_users_order function to get all user's purchase]
         * @param  {[object]} headers      [description]
         * @param  {[string]} search_query [description]
         * @return {[Json]}              [Product object]
         */
        get_users_order: function(headers,limit,offset) {
          //check for valid api authentication
                  apiAuth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                          apiAuth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"admin not authorized"}));
                              }else{
                                //search all product having same query string
                                  users.get_all_purchase(headers.user_id, limit,offset, function(err, result) {
                                    console.log(err);
                                    console.log(result);
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                        //let product = [];
                                        response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [order_create function to purchase food]
         * @param  {[object]} postData [purchase data]
         * @param  {[object]} headers  [user info]
         * @return {[json]}          [success/ failure]
         */
        order_food: function(orderData, headers) {
          //check for valid api authentication
                  apiAuth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //check for user authentication
                          apiAuth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"admin not authorized"}));
                              }else{
                                 //update product
                                  orderData.user_id = parseInt(headers.user_id);
                                  console.log(orderData);
                                  users.createOrder(orderData, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                      if(result === false){
                                        response.end(JSON.stringify({"status":201,"success":false,"message":"result"}));
                                      }else{
                                        response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                                      }
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [update_product function to update product info]
         * @param  {[object]} postData [product data]
         * @param  {[object]} headers  [user info]
         * @return {[json]}          [success/ failure]
         */
        update_user: function(userData, headers) {
          //check for valid api authentication
                  apiAuth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //check for user authentication
                          apiAuth.admin_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"admin not authorized"}));
                              }else{
                                 //update product
                                  users.updateUser(userData, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                      if(result === false){
                                        response.end(JSON.stringify({"status":201,"success":false,"message":"No Such product exists for user"}));
                                      }else{
                                        //get upadated product info and return
                                        let data = {
                                          "id" :  userData.id,
                                          "first_name" :  userData.first_name
                                        }
                                        response.end(JSON.stringify({"status":200,"success":true,"data":data}));
                                      }
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
        /**
         * [update_product function to update product info]
         * @param  {[object]} postData [product data]
         * @param  {[object]} headers  [user info]
         * @return {[json]}          [success/ failure]
         */
        update_user_info: function(userData, headers) {
          //check for valid api authentication
                  apiAuth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //check for user authentication
                          apiAuth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"admin not authorized"}));
                              }else{
                                 //update product
                                  users.updateUser(userData, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                      if(result === false){
                                        response.end(JSON.stringify({"status":201,"success":false,"message":"No Such product exists for user"}));
                                      }else{
                                        //get upadated product info and return
                                        let data = {
                                          "id" :  userData.id,
                                          "first_name" :  userData.first_name
                                        }
                                        response.end(JSON.stringify({"status":200,"success":true,"data":data}));
                                      }
                                    }
                                });
                              }
                            }
                        });
                      }
                    }
                });
        },
    }
    };
