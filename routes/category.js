var express = require("express");
var categoryRouter = express.Router();
var mongojs = require("mongojs");
var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["categories", "books"]);


categoryRouter.route("/").get(function(request, response){
    db.categories.find(function(error, categories){
        if(error){
        // response.render("error.html");
        }
        response.json(categories);
    })
});

categoryRouter.route("/:id").get(function(request, response){
    db.books.find({category: request.params.id}, function(error, categories){
        if(error){
        // response.render("error.html");
        }
        response.json(categories);
    })
});


module.exports = categoryRouter;
