/*
    @author - Himanshu
    User controller responsible to get the business login from models
     and send appropriate response to end user
 */


"use strict"
//load all modules
let products = require('../models/products.js');
let Auth = require('../models/authentication.js');

module.exports = function(response) {
    return {
      /**
       * [create_product function to create a product]
       * @param  {[Object]} postData [product info]
       * @param  {[obejct]} headers  [user headers]
       * @return {[Object]}          [success false or true ]
       */
       /**
        * [get_all_products function to get all product on basis of limit and offset staring]
        * @param  {[object]} headers      [description]
        * @param  {[string]} search_query [description]
        * @return {[Json]}              [Product object]
        */
       get_all_products: function(headers,limit,offset) {
         //check for valid api authentication
                 Auth.api_authentication(headers.api_key, function(err, result) {
                   if (err) {
                       response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                   } else {
                     if(result === false){
                       response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                     }else{
                               //search all product having same query string
                                 products.get_all_products(limit,offset, function(err, result) {
                                     console.log(err);
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
       },
        create_product: function(postData, headers) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //check for valid user authentication
                          Auth.admin_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"user not authorized"}));
                              }else{
                                //if user valid insert product into database
                                  postData.admin_id = headers.user_id;
                                  products.createProduct(postData, function(err, result) {
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
         * [delete_product function to delete a product, only creator can delete]
         * @param  {[object]} headers    [user headers]
         * @param  {[int]} product_id [product_id]
         * @return {[object]}            [success or failure]
         */
        delete_product: function(headers, product_id) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //check for user authentication
                          Auth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"user not authorized"}));
                              }else{
                                //if user is crator of product and valid also then delete product
                                  products.deleteProduct(headers.user_id,product_id, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                      if(result === true){
                                        response.end(JSON.stringify({"status":200,"success":true,"message":"Product deleted successfully"}));
                                      }else{
                                        response.end(JSON.stringify({"status":201,"success":false,"message":"No Such product exists for user"}));
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
         * [delist_product admin can delist a product]
         * @param  {[Object]} headers [user info headers]
         * @param  {[int]} product [product_id]
         * @return {[Json]}         [description]
         */
        delist_product: function(headers, product_id) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //check for valid user and having role of admin
                          Auth.admin_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"user not authorized"}));
                              }else{
                                    //delist product from database
                                    products.delistProduct(product_id, function(err, result) {
                                      if (err) {
                                          response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                      } else {
                                        if(result === true){
                                          response.end(JSON.stringify({"status":200,"success":true,"message":"Product deactivated successfully successfully"}));
                                        }else{
                                          response.end(JSON.stringify({"status":201,"success":false,"message":"No Such product exists for user"}));
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
         * [get_product function to get product based on product_id]
         * @param  {[object]} headers    [user info]
         * @param  {[int]} product_id [product_id]
         * @return {[json]}            [description]
         */
        get_product: function(headers, product_id) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                            //get data of product for view
                              products.get_product(product_id, function(err, result) {
                                if (err) {
                                    response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                } else {
                                  if(result === false){
                                    response.end(JSON.stringify({"status":201,"success":false,"message":"No Such product exists for user"}));
                                  }else{
                                    //append product info and send
                                    response.end(JSON.stringify({"status":200,"success":true,"data":result}));
                                  }
                                }
                            });
                      }
                    }
                });
        },
        /**
         * [get_product function to get product based on product_slug]
         * @param  {[object]} headers    [user info]
         * @param  {[string]} product_slug [product_id]
         * @return {[json]}            [description]
         */
        get_product_by_slug: function(headers, product_slug) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                            //get data of product for view
                              products.get_product_by_slug(product_slug, function(err, result) {
                                if (err) {
                                    response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                } else {
                                  if(result === false){
                                    response.end(JSON.stringify({"status":201,"success":false,"message":"No Such product exists"}));
                                  }else{
                                    //append product info and send
                                    response.end(JSON.stringify({"status":200,"success":true,"data":result}));
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
        search_product: function(headers, search_query,offset) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                          Auth.user_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"user not authorized"}));
                              }else{
                                //search all product having same query string
                                  products.searchProduct(search_query,offset, function(err, result) {
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
         * [update_product function to update product info]
         * @param  {[object]} postData [product data]
         * @param  {[object]} headers  [user info]
         * @return {[json]}          [success/ failure]
         */
        update_product: function(postData, headers) {
          //check for valid api authentication
                  Auth.api_authentication(headers.api_key, function(err, result) {
                    if (err) {
                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                    } else {
                      if(result === false){
                        response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
                      }else{
                        //check for user authentication
                          Auth.admin_authentication(headers, function(err, result) {
                            if (err) {
                                response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                            } else {
                              if(result === false){
                                response.end(JSON.stringify({"status":401,"success":false,"message":"user not authorized"}));
                              }else{
                                 //update product
                                  products.updateProduct(postData, function(err, result) {
                                    if (err) {
                                        response.end(JSON.stringify({"status":500,"success":false,"message":"Internal server error"}));
                                    } else {
                                      if(result === false){
                                        response.end(JSON.stringify({"status":201,"success":false,"message":"No Such product exists for user"}));
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
    }
};
