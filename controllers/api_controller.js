/*
    @author - Himanshu
    Api controller for creating api
 */

"use strict"
//include all modules
let apiAuth = require('../models/authentication.js');

// Export functions
module.exports = function(response) {
    return {
      //function to create api_auth
      api_auth: function(data) {
                   //if api_key is valid and no serevr error process to login
                     apiAuth.create_api_auth(data, function(err, result) {
                       console.log(err);
                       if (err) {
                           response.end(JSON.stringify({"status":203,"success":false,"message":"Invalid server error"}));
                       } else {
                           response.end(JSON.stringify({"status":200,"success":true,"data":"api auth created successfully"}));
                       }
                   });
       }
    }
};
