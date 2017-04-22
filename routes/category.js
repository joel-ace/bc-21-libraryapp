var express = require("express");
var categoryRouter = express.Router();
var mongojs = require("mongojs");
var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["categories", "books"]);

categoryRouter.route("/").get(function(request, response){

    var Sess = {
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }
    
    db.categories.find(function(error, categories){
        if(!error){
            response.render("category.ejs", { 
                categories: categories, 
                Sess: Sess 
            });
        }
    })
});

categoryRouter.route("/:id").get(function(request, response){

    var Sess = {
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }

    var catTitle;

    db.books.find({category: request.params.id}, function(error, books){

        db.categories.findOne({_id: mongojs.ObjectId(request.params.id)}, function(error, category){
            if(!error){
                response.render("books.ejs", { 
                    books: books, 
                    pgTitle: "Books on " + category.title,
                    Sess: Sess 
                });
            }
        })
    })
});


module.exports = categoryRouter;
