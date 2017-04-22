var express = require("express");
var adminRouter = express.Router();
var mongojs = require("mongojs");
var logic = require("../functions");

var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["books", "categories"]);


adminRouter.route("/").get(function(request, response){
    response.render("dashboard.ejs");
});

// Add Book
adminRouter.route("/add-book").get(function(request, response){

    var Sess = {
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }
    
    db.categories.find(function(error, categories){
        if(!error){
            response.render("addBook.ejs", {
                categories: categories, 
                Sess: Sess
            });
        }
    })
});

// Update book
adminRouter.route("/book/:id").get(function(request, response){

    var Sess = {
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }

    db.books.findOne({_id: mongojs.ObjectId(request.params.id)}, function(error, book){
        if(!error && book){
            db.categories.find(function(error, categories){
                if(!error){
                    response.render("editBook.ejs", {
                        book: book, 
                        categories: categories, 
                        Sess: Sess
                    });
                }
            })                
        } 
    })
});

// Add Category
adminRouter.route("/add-category").get(function(request, response){
    var Sess = {
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }
    response.render("addCategory.ejs", {Sess: Sess});
});

// Manage Books
adminRouter.route("/manage-books").get(function(request, response){  

    var Sess = {
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }
      
    db.books.find(function(error, books){
        if(!error){
            response.render("manageBooks.ejs", {
                books: books.reverse(),
                Sess: Sess
            });
        }
    })
});

module.exports = adminRouter;
