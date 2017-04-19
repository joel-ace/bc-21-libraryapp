var express = require("express");
var bookRouter = express.Router();
var mongojs = require("mongojs");


bookRouter.route("/").get(function(request, response){
    // response.render("books.html");
});

module.exports = bookRouter;
