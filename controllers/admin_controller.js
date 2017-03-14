/*
    @author - Himanshu
    User controller responsible to get the business login from models
     and send appropriate response to end user
 */

"use strict"
//include all modules
let users = require('../models/users.js');
let admin = require('../models/admin.js');
let apiAuth = require('../models/authentication.js');

// Export functions
module.exports = function(response) {
    return {
      /**
       * [admin registartion function]
       * @param  {[object]} postData [admin data (email, password, mobile,name)]
       * @param  {[string]} api_key  [api authentication key]
       * @return {[object]}          [json success/failure object]
       */
        sign_up: function(postData,api_key) {
          console.log(postData.password);
            if(postData.email != undefined && postData.email != null && postData.password != undefined && postData.password != null){
                //check for valid api authentication
                  apiAuth.api_authentication(api_key, function(err, result) {
                    console.log(err);
                    if (err) {
                        //Database error
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      //if api authentication failed return false message
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //check if email is already exists
                        admin.check_if_email_exists(postData.email, function(err, result) {
                          console.log(err);
                          if (err) {
                              //Database error
                              response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                          } else {
                            //if api authentication sucess and no email exists process to admin sign up
                              if(result === true){
                                admin.adminSignUp(postData, function(err, result) {
                                  //send success response in case success registration
                                  //@return user_id, auth_token and user email
                                  console.log(err);
                                  if (err) {
                                      response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                  } else {
                                      response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                                  }
                              });
                            }else{
                                response.end(JSON.stringify({"status":203,"success":false,"message":"Email id already exists"}));
                            }
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
         * [admin registartion function]
         * @param  {[object]} postData [admin data (email, password, mobile,name)]
         * @param  {[string]} api_key  [api authentication key]
         * @return {[object]}          [json success/failure object]
         */
          create_users : function(postData,api_key) {

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
                          //check if email is already exists
                          users.check_if_email_exists(postData.email, function(err, result) {
                            if (err) {
                              console.log(err);
                                //Database error
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              //if api authentication sucess and no email exists process to admin sign up
                                if(result === true){
                                  admin.createUser(postData, function(err, result) {

                                    //send success response in case success registration
                                    //@return user_id, auth_token and user email
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                        response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                                    }
                                });
                              }else{
                                  response.end(JSON.stringify({"status":203,"success":false,"message":"Email id already exists"}));
                              }
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
         * [cance_order function]
         * @param  {[object]} postData [admin data (id,auth)]
         * @param  {[string]} api_key  [api authentication key]
         * @return {[object]}          [json success/failure object]
         */
          cancel_order : function(postData,headers) {
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
                                    admin.cancelOrder(postData, function(err, result) {
                                      console.log(err);
                                      if (err) {
                                          response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                      } else {
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
           * [complete_order function]
           * @param  {[object]} postData [admin data (id,auth)]
           * @param  {[string]} api_key  [api authentication key]
           * @return {[object]}          [json success/failure object]
           */
            complete_order : function(postData,headers) {
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
                                      admin.completeOrder(postData, function(err, result) {
                                        console.log(err);
                                        if (err) {
                                            response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                        } else {
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
           * [get_all_order function to get all user's purchase]
           * @param  {[object]} headers      [description]
           * @param  {[string]} search_query [description]
           * @return {[Json]}              [Product object]
           */
          get_all_order: function(headers,limit,offset) {
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
                                    admin.get_all_purchase(headers.user_id, limit,offset, function(err, result) {
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
                          admin.login(userData, function(err, result) {
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
        }
    }
};
