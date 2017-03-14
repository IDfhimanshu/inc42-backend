/**
 * @author - Himanshu
 * Product model represents all business logic of app for products,
 * all backeend code should be writeen here
 */
"use strict"
let db = require('../config/database.js');

//Export function

module.exports = {
  /**
   * [createProduct function to create a product]
   * @param  {[product info ]}   product  [description]
   * @param  {Function} callback [callback to product controller's create_product]
   * @return {[JSON ]}            [Object]
   */
  createProduct: function(product,callback) {
    //generate a unique product url
    product.product_name =  (product.product_name).replace(/\s+/g, '');
    let generatedProductUrl = module.exports.generate_product_url(product.product_name);
    product.product_slug = generatedProductUrl;
    //insert into product database
    db.query('INSERT INTO products SET ?', product, function(error,result) {
      console.log(error);
        if (!error) {
          let data = {
            product_id : result.insertId,
            product_name : product.product_name,
            product_slug: generatedProductUrl
          };
          //callback success
          callback(0, data);
        } else
        //callback failure
        callback(error);
    });
  },
  /**
   * [deleteProduct function to delete a product]
   * @param  {[int]}   user_id    [user_id]
   * @param  {[int]}   product_id [product_id]
   * @param  {Function} callback   [callback function]
   * @return {[JSON]}              [object]
   */
  deleteProduct: function(user_id,product_id, callback) {
    //check for valid user of this product
      module.exports.product_auth(user_id,product_id, function(err, result) {
        if (err) {
            callback(error);
        } else {
          //if valid delete from database
            if(result === true){
              db.query('DELETE FROM products WHERE id = ?', [product_id], function(error,result) {
                  if (!error) {
                    //callback
                    callback(0, true);
                  } else
                  callback(error);
              });
            }else{
              callback(0, false)
            }
        }
    });
  },
  /**
   * [delistProduct function to delist product from database]
   * @param  {[int]}   user_id    [user_id]
   * @param  {[int]}   product_id [product_id]
   * @param  {Function} callback   [callback]
   * @return {[JSON]}              [object]
   */
  delistProduct: function(product_id, callback) {
    //check if product exists or not call self module function using module.exports
        db.query('UPDATE products Set ? WHERE id = ?', [{ active:0 }, product_id], function(error,result) {
            if (!error) {
              callback(0, true);
            } else
            console.log(error);
            callback(error);
        });
  },
  /**
   * [viewSingleProduct function to view single prouct]
   * @param  {[int]}   product_id [description]
   * @param  {Function} callback   [description]
   * @return {[Json]}              [description]
   */
  get_product: function(product_id, callback) {
        //get all info of active product with this id
            db.query('select * FROM products WHERE id = ?', [product_id], function(error,result) {
                if (!error) {
                  callback(0, result);
                } else
                callback(error);
            });
  },
  /**
   * [get_product_by_slug function to view single prouct by slug]
   * @param  {[slug]}   product_slug [description]
   * @param  {Function} callback   [description]
   * @return {[Json]}              [description]
   */
  get_product_by_slug: function(product_slug, callback) {
        //get all info of active product with this id
            db.query('select * FROM products WHERE product_slug = ?', [product_slug], function(error,result) {
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
   * [get all product ]
   * @param  {[string]}   search_query [description]
   * @param  {Function} callback     [description]
   * @return {[JSON]}                [description]
   */
  get_all_products: function(limit,offset, callback) {
    //get all users
    var data = {};
          db.query('select * FROM products order by date_added DESC LIMIT '  + limit + ' OFFSET ' + offset, function(error,result) {
              if (!error) {
                data.products = result;
                db.query('select count(*) as productCount FROM products', function(error,rows) {
                    if (!error) {
                       data.count = rows[0].productCount;
                      callback(0,data);
                    } else
                    callback(0,error);
                });
              } else
              callback(0,error);
          });
  },
  /**
   * [searchProduct fucntion to search product basis on query string]
   * @param  {[string]}   search_query [description]
   * @param  {Function} callback     [description]
   * @return {[JSON]}                [description]
   */
  searchProduct: function(search_query,offset, callback) {
    //get all alike query products, using mysql-mongo namespace
          db.query('select product_name, product_desc,product_url,product_price,date_added FROM products where product_name LIKE ' + db.escape('%'+search_query+'%') + 'LIMIT 1 OFFSET ' + offset, function(error,result) {
              if (!error) {
                callback(0, result);
              } else
              console.log(error);
          });
  },
  /**
   * [updateProduct function to update a function ]
   * @param  {[type]}   product  [object]
   * @param  {Function} callback [description]
   * @return {[json]}            [description]
   */
  updateProduct: function(product, callback) {
      //update product info here
          db.query('UPDATE products SET ? WHERE id = ?', [{ product_name:product.product_name , product_desc : product.product_desc,product_price : product.product_price,product_sku:product.product_sku,product_stock:product.product_stock,meal_type:product.meal_type,meal_serving_type:product.meal_serving_type,active:product.active}, product. product_id], function(error,result) {
              if (!error) {
                callback(0, result);
              } else
              callback(error);
          });
  },
  /**
   * [generate_product_url function to generate random url and append to product_name]
   * @param  {[string]} product_name [description]
   * @return {[string]}              [product url]
   */
  generate_product_url : function(product_name){
    //get 6 random string and appned to product name
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-'
    let result = '';
    for (let i = 6; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return product_name + '-' + result;
  },
  /**
   * [product_auth for checking product authentication if user created this product or nor ]
   * @param  {[int]}   user_id    [description]
   * @param  {[object]}   product_id [description]
   * @param  {Function} callback   [description]
   * @return {[JSON]}              [description]
   */
  product_auth : function(user_id,product_id,callback){
    //get user's product info
    db.query('SELECT count(*) as productCount FROM products WHERE id = ? and user_id = ? and active = 1', [product_id, user_id], function(error,rows) {
        if (!error) {
          if(rows[0].productCount){
            //if found callback success else failure
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
   * [check_product_exists checks if product exists and active in database]
   * @param  {[int]}   product_id [description]
   * @param  {Function} callback   [description]
   * @return {[Json]}              []
   */
  check_product_exists : function(product_id,callback){
    db.query('SELECT count(*) as productCount FROM products WHERE id = ? and  active = 1 ', [product_id], function(error,rows) {
        if (!error) {
          if(rows[0].productCount){
            callback(0, true);
          }else{
            callback(0,false);
            // response.end(JSON.stringify({"status":401,"success":false,"message":"Not authorized"}));
          }
        } else
        callback(error);
    });
  }
};
