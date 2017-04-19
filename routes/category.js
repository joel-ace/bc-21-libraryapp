var express = require("express");
var categoryRouter = express.Router();
var mongojs = require("mongojs");
var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["categories"]);


categoryRouter.route("/").get(function(request, response){
    db.categories.find(function(error, categories){
        if(error){
        // response.render("error.html");
        }
        response.json(categories);
    })
});

// For single Book
categoryRouter.route("/:id").get(function(request, response){
    db.books.findOne({_id: mongojs.ObjectId(request.params.id)} , function(error, category){
        if(error){
        // response.render("error.html");
        }
        response.render("singleBook.ejs", {category: category});
    })
});

module.exports = categoryRouter;
