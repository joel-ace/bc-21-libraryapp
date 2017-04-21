var express = require("express");
var bookRouter = express.Router();
var mongojs = require("mongojs");
var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["books"]);

bookRouter.route("/").get(function(request, response){

    var Sess = {
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }
        
    db.books.find({available: "1"}, function(error, books){
        if(!error){
            response.render("books.ejs", {
                books: books.reverse(), 
                Sess: Sess,
                pgTitle: "Books"
            });
        }
    })
});

// For single Book
bookRouter.route("/:id").get(function(request, response){

    var Sess = {
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }
    
    db.books.findOne({_id: mongojs.ObjectId(request.params.id)} , function(error, book){

        if(!error){
            response.render("singleBook.ejs", {
                book: book,
                Sess: Sess
            });
        }
    })
});

module.exports = bookRouter;
