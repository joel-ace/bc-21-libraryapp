var express = require("express");
var adminRouter = express.Router();
var mongodb= require("mongodb").MongoClient;


adminRouter.route("/login").get(function(request, response){
    response.render("login.html");
});
// adminRouter.route("/login").get(function(request, response){
//     response.render("login.html");
// });

module.exports = adminRouter;
