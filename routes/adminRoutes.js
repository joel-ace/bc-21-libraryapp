var express = require("express");
var adminRouter = express.Router();
var mongojs = require("mongojs");
var logic = require("../functions");

var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["books", "categories"]);

adminRouter.route("/").get(function(request, response){
    if(logic.isLoggedIn()){
        response.render("dashboard.ejs");
    } else {
        response.render("login.ejs");
    }
});

// Add Book
adminRouter.route("/add-book").get(function(request, response){

    if(logic.isLoggedIn()){
        db.categories.find(function(error, categories){
            if(!error){
                response.render("addBook.ejs", {categories: categories});
            }
        })
    } else {
        response.render("login.ejs");
    }
});

// Update book
adminRouter.route("/book/:id").get(function(request, response){
    if(logic.isLoggedIn()){
        db.books.findOne({_id: mongojs.ObjectId(request.params.id)}, function(error, book){
            if(!error && book){
                db.categories.find(function(error, categories){
                    if(!error){
                        response.render("editBook.ejs", {book: book, categories: categories});
                    }
                })                
            } else {

            }
        })
    } else {
        response.render("login.ejs");
    }
});

// Add Category
adminRouter.route("/add-category").get(function(request, response){
    if(logic.isLoggedIn()){
        response.render("addCategory.ejs");
    } else {
        response.render("login.ejs");
    }
});

// Manage Books
adminRouter.route("/manage-books").get(function(request, response){    
    if(logic.isLoggedIn()){
        db.books.find(function(error, books){
            if(!error){
                response.render("manageBooks.ejs", {books: books.reverse()});
            }
        })
    } else {
        response.render("login.ejs");
    }
});

module.exports = adminRouter;
