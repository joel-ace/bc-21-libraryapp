var express = require("express");
var bookRouter = express.Router();
var mongojs = require("mongojs");
var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["books"]);


bookRouter.route("/").get(function(request, response){
    db.books.find(function(error, books){
        if(error){
        // response.render("error.html");
        }
        response.render("books.ejs", {books: books});
    })
});

// For single Book
bookRouter.route("/:id").get(function(request, response){
    db.books.findOne({_id: mongojs.ObjectId(request.params.id)} , function(error, book){
        if(error){
        // response.render("error.html");
        }
        response.render("singleBook.ejs", {book: book});
    })
});

// Borrow book
bookRouter.route("/borrow-book/:id").put(function(request, response){
    // var book = request.body;
    // var borrowBook = {};

    // if(book.title && book.available){

    //     db.books.update({_id: mongojs.ObjectId(request.params.id)}, borrowBook, {}, function(error, book){
    //         if(error){
    //         // response.render("error.html");
    //         }
    //         response.json(book);
    //     })
    // } else {
    //     response.status(400);
    //     response.json({
    //         "error": "Bad Data"
    //     })
    // }

});




module.exports = bookRouter;
