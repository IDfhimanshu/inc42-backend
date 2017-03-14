/*
    @author - Himanshu
    @Date - Jan26, 2015
    @entry js file where all the routes and server configuration are mentioned
 */

"use strict";
//load all required module

const http = require('http');
const url = require('url');
let users = require('./controllers/users_controller.js');
let api = require('./controllers/api_controller.js');
let products = require('./controllers/products_controller.js');
let admin = require('./controllers/admin_controller.js');
const limit = 5;
/**
 * Creating the server with request and response parameters
 * request : standard request object
 * response : standard response object
 * server listen :   liting to 8002
 **/
const server = http.createServer(function(request,response,next){
  //get request url, provides url string
  let url_parts = url.parse(request.url);
  let slashLocation = url_parts.pathname.toString().substring(1).indexOf('/');
  let updatedPathName = url_parts.pathname;

  //get all controllers
  let userController = users(response);
  let apiController = api(response);
  let productController = products(response);
  let adminController = admin(response);
  //handling Cors issue
  let headers = {};

  // set header to handle the CORS
  headers['Access-Control-Allow-Origin'] = '*';
  headers['Access-Control-Allow-Headers'] = 'Content-Type, Content-Length,api_key,user_id,auth_token, Authorization, Accept, X-Requested-With';
  headers['Access-Contrl-Allow-Methods'] = 'PUT, POST, GET, DELETE, OPTIONS';
  headers["Access-Control-Max-Age"] = '86400';
  response.writeHead(200, headers);

  if ( request.method === 'OPTIONS' ) {
      console.log('OPTIONS SUCCESS');
      response.end();
  }else {
  /*
    Create routes for each api using switch case, along with http method and call it's
    appropriate controller function if no route found redirect to 404 .
    - path name is key value for switch
   */
  switch (updatedPathName) {
    //route for home page
      case '/':
          if(request.method == 'GET' ){
            userController.home();
          }else{
            response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
          }
          break;
      //api route for create api auth token
      case '/api/auth':
               if(request.method == 'POST' ){
                 let apiData = '';
                 request.on('data', function (data) {
                     apiData += data;
                  });
                 request.on('end', function () {
                   apiController.api_auth(JSON.parse(apiData));
                 });
               }else{
                 response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
               }
               break;
      //Api for getting all users
      case '/admin/users/get/all':
            if(request.method == 'GET' ){
              let param = url_parts.query.toString().split("?");
              let offset= param[0].split("=")[1];
              userController.get_all_users(request.headers,limit,offset);
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
          break;
          case '/admin/users/get':
                if(request.method == 'GET' ){
                  let param = url_parts.query.toString().split("?");
                  let user_id= param[0].split("=")[1];
                  userController.get_user(request.headers,user_id);
                }else{
                  response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                }
              break;
        //get user it's own profile
        case '/users/get':
              if(request.method == 'GET' ){
                let param = url_parts.query.toString().split("?");
                let user_id= param[0].split("=")[1];
                userController.get_user_info(request.headers,user_id);
              }else{
                response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
              }
            break;
      //route for user sign up
      case '/users/signup':
          if(request.method == 'POST' ){
            //getting post request data wait for request to end the data and
            // call corrensponding controller action
            let postData = '';
            request.on('data', function (data) {
                postData += data;
             });
            request.on('end', function () {
              userController.sign_up(JSON.parse(postData),request.headers.api_key);
            });
          }else{
            response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
          }
          break;
          //route for admin sign up
          case '/admin/signup':
              if(request.method == 'POST' ){
                //getting post request data wait for request to end the data and
                // call corrensponding controller action
                let postData = '';
                request.on('data', function (data) {
                    postData += data;
                 });
                request.on('end', function () {
                  adminController.sign_up(JSON.parse(postData),request.headers.api_key);
                });
              }else{
                response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
              }
              break;
            //Api for creating user by admin
            case '/admin/users/create':
                if(request.method == 'POST' ){
                  //getting post request data wait for request to end the data and
                  // call corrensponding controller action
                  let postData = '';
                  request.on('data', function (data) {
                      postData += data;
                   });
                  request.on('end', function () {
                    adminController.create_users(JSON.parse(postData),request.headers.api_key);
                  });
                }else{
                  response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                }
                break;
                //Api for creating user
                case '/users/signup':
                    if(request.method == 'POST' ){
                      //getting post request data wait for request to end the data and
                      // call corrensponding controller action
                      let postData = '';
                      request.on('data', function (data) {
                          postData += data;
                       });
                      request.on('end', function () {
                        userController.sign_up(JSON.parse(postData),request.headers.api_key);
                      });
                    }else{
                      response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                    }
                    break;
              //route for admin sign up
              case '/admin/signin':
                  if(request.method == 'POST' ){
                    //getting post request data wait for request to end the data and
                    // call corrensponding controller action
                    let postData = '';
                    request.on('data', function (data) {
                        postData += data;
                     });
                    request.on('end', function () {
                      adminController.sign_in(JSON.parse(postData),request.headers.api_key);
                    });
                  }else{
                    response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                  }
                  break;
          //routes responsible for user login
        case '/users/signin':
            if(request.method == 'POST' ){
              let userData = '';
              request.on('data', function (data) {
                  userData += data;
               });
              request.on('end', function () {
                userController.sign_in(JSON.parse(userData),request.headers.api_key);
              });
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
            //route for getting all the product
          case '/products/get/all':
                if(request.method == 'GET' ){
                  let param = url_parts.query.toString().split("?");
                  let offset= param[0].split("=")[1];
                  productController.get_all_products(request.headers,limit,offset);
                }else{
                  response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                }
              break;
        //routes for creating the product
        case '/admin/products/create':
            if(request.method == 'POST' ){
              let productData = '';
              request.on('data', function (data) {
                  productData += data;
               });
              request.on('end', function () {
                productController.create_product(JSON.parse(productData),request.headers);
              });
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
          //route to delete user from database
          //route for deleting the product
          case '/admin/users/delete':
              if(request.method == 'POST' ){
                let id = url_parts.query.toString().split("=");
                let user_id = id[1];
                  userController.delete_user(request.headers,parseInt(user_id));
              }else{
                response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
              }
              break;
            //route for delisting the product, Only admin has rights to do so
        case '/products/delete':
            if(request.method == 'POST'){
              let id = url_parts.query.toString().split("=");
              let productId = id[1];
              productController.delist_product(request.headers, productId);
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
        //get individual product detail route
        case '/product/get':
            if(request.method == 'GET'){
              let id = url_parts.query.toString().split("=");
              let product_id = id[1];
                productController.get_product(request.headers,parseInt(product_id));
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
        //get product by slug
        case '/product/get/slug':
            if(request.method == 'GET' ){
              let id = url_parts.query.toString().split("=");
              let product_slug = id[1];
                productController.get_product_by_slug(request.headers,product_slug);
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
        // update user detail
        case '/admin/users/update':
            if(request.method == 'POST' ){
              let userData = '';
              request.on('data', function (data) {
                  userData += data;
               });
              request.on('end', function () {
                userController.update_user(JSON.parse(userData),request.headers);
              });
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
        // update user detail
        case '/user/update':
            if(request.method == 'POST' ){
              let userData = '';
              request.on('data', function (data) {
                  userData += data;
               });
              request.on('end', function () {
                userController.update_user_info(JSON.parse(userData),request.headers);
              });
            }else{
              response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
            }
            break;
          //purchase food function
          case '/order/create':
              if(request.method == 'POST' ){
                let orderData = '';
                request.on('data', function (data) {
                    orderData += data;
                 });
                request.on('end', function () {
                  userController.order_food(JSON.parse(orderData),request.headers);
                });
              }else{
                response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
              }
              break;
            //function to get user's order
            case '/order/all':
                  if(request.method == 'GET' ){
                    let param = url_parts.query.toString().split("?");
                    let offset= param[0].split("=")[1];
                    userController.get_users_order(request.headers,limit,offset);
                  }else{
                    response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                }
                break;
            //function to cancel order
            case '/admin/order/cancel':
                if(request.method == 'POST' ){
                  let orderData = '';
                  request.on('data', function (data) {
                      orderData += data;
                   });
                  request.on('end', function () {
                    adminController.cancel_order(JSON.parse(orderData),request.headers);
                  });
                }else{
                  response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                }
                break;
                //function to complete order
                case '/admin/order/complete':
                    if(request.method == 'POST' ){
                      let orderData = '';
                      request.on('data', function (data) {
                          orderData += data;
                       });
                      request.on('end', function () {
                        adminController.complete_order(JSON.parse(orderData),request.headers);
                      });
                    }else{
                      response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                    }
                    break;
              //get all order by admin
              case '/admin/order/all':
                    if(request.method == 'GET' ){
                      let param = url_parts.query.toString().split("?");
                      let offset= param[0].split("=")[1];
                      adminController.get_all_order(request.headers,limit,offset);
                    }else{
                      response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                  }
                  break;
            case '/product/update':
                if(request.method == 'POST' ){
                  let productData = '';
                  request.on('data', function (data) {
                      productData += data;
                   });
                  request.on('end', function () {
                    productController.update_product(JSON.parse(productData),request.headers);
                  });
                }else{
                  response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
                }
                break;
          //route for searching the product
        case '/products/search':
              if(request.method == 'GET' ){
                let param = url_parts.query.toString().split("&");
                let search_query = param[0].split("=")[1];
                let offset= param[1].split("=")[1];
                  productController.search_product(request.headers,search_query,offset);
              }else{
                response.end(JSON.stringify({"status":405,"message":"Method not allowed"}));
              }
            break;
        //default route if no match redirect to 404
        default:
                  console.log('404, Page not found');

                  response.end(JSON.stringify({"status":404,"message":"No page Found"}))
          };
        }
}).listen(process.env.PORT || 5000)
