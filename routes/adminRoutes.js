var express = require("express");
var adminRouter = express.Router();
var mongojs = require("mongojs");
var logic = require("../functions");
var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["books", "categories"]);



adminRouter.route("/").get(function(request, response){
    if(logic.isLoggedIn()){
        response.render("addBook.ejs");
    } else {
        response.render("login.ejs");
    }
});


// Add Book
adminRouter.route("/add-book").post(function(request, response){
    var book = request.body;
    if(!book.title || book.available){
        response.status(400);
        response.json({
            "error": "Enter Book title and availability status"
        })
    } else {
        db.books.save(book, function(err, book){
            if(err){
                response.send(err);
            }
            response.json(book);
        })
    }
});

// Delete Book
adminRouter.route("/delete/:id").delete(function(request, response){
    db.books.remove({_id: mongojs.ObjectId(request.params.id)} , function(error, book){
        if(error){
        // response.render("error.html");
        }
        response.json(book);
    })
});

// Update books
adminRouter.route("/update/:id").put(function(request, response){
    var book = request.body;
    var updateBook = {};

    if(book.title && book.available){
        updateBook.title = book.title,
        updateBook.category = book.category,
        updateBook.author = book.author,
        updateBook.available = book.available

        db.books.update({_id: mongojs.ObjectId(request.params.id)}, updateBook, {}, function(error, book){
            if(error){
            // response.render("error.html");
            }
            response.json(book);
        })
    } else {
        response.status(400);
        response.json({
            "error": "Bad Data"
        })
    }

});

// Add Category
adminRouter.route("/add-category").post(function(request, response){
    var category = request.body;
    if(!category.title){
        response.status(400);
        response.json({
            "error": "Enter Category title"
        })
    } else {
        db.categories.save(category, function(err, category){
            if(err){
                response.send(err);
            }
            response.json(category);
        })
    }
});


module.exports = adminRouter;
