var express = require("express");
var apiRouter = express.Router();
var mongojs = require("mongojs");
var jsonwebtoken = require("jsonwebtoken");
var logic = require("../functions");

var secret = "myfirstjavascriptappever";

var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["books", "categories", "users"]);

// Authenticate User
apiRouter.route("/authenticate").post(function(request, response){
    db.users.findOne({email: request.body.email}, function(error, User){
        if(!error){
            if(!User){
                response.json({success: false, message: "Failed! User doesn't not exist."})
            } else if(User.password != request.body.password) {
                response.json({success: false, message: "This password is incorrect."})
            } else {
                request.session.user = User._id;
                request.session.name = User.name;
                request.session.account = User.admin;
                if(User.admin == "adminAccount"){
                    var url = "/admin/manage-books";
                } else {
                    var url = "/books";
                }
                response.json({
                    success: true, 
                    message: "Login Successful! You will be redirected soon",
                    url: url
                });                
            }
        }
    });

});

// Add User
apiRouter.route("/add-user").post(function(request, response){
    var user = request.body;
    if(!user.email || !user.password || !user.name){
        response.json({
            success: false, 
            message: "Your Name, Email and Password is required",
        })
    } else {
        db.users.save(user, function(err, User){
            if(err){
                response.json({
                    success: false, 
                    message: "Seems there's a glitch, Please try again later",
                });    
            } else {
                response.json({
                    success: true, 
                    message: "Registration Successful! You will be redirected soon",
                    url: "/login"
                });    
            }            
        })
    }
});

// Add Book
apiRouter.route("/add-book").post(function(request, response){
    if(request.session.account == "adminAccount"){
        var book = request.body;
        if(!book.title || !book.available){
            response.json({
                "error": "Enter Book title and availability status"
            })
        } else {
            db.books.save(book, function(err, book){
                if(err){
                response.json({
                    success: false, 
                    message: "Sorry, we couldn't add Book"
                })
                }
                response.json({
                    success: true, 
                    message: "Book added Sucessfully"
                })
            })
        }
    }
});

// Delete Book
apiRouter.route("/delete-book/:id").delete(function(request, response){
    if(request.session.account == "adminAccount"){
        if(request.params.id){
            db.books.remove({_id: mongojs.ObjectId(request.params.id)} , function(error, book){
                if(error){
                    response.json({
                        success: false, 
                        message: "Seem there's a glitch, Please try again later"
                    })
                }
                response.json({
                    success: true, 
                    message: "Book deleted Sucessfully"
                })
            })
        } else {
            response.json({
                success: false, 
                message: "Book doesn't exist"
            })
        }
    }
});

// Update books
apiRouter.route("/update-book/:id").put(function(request, response){
    if(request.session.account == "adminAccount"){
        var book = request.body;
        var updateBook = {};

        if(book){
            updateBook.title = book.title,
            updateBook.category = book.category,
            updateBook.author = book.author,
            updateBook.synopsis = book.synopsis,
            updateBook.available = book.available

            db.books.update({_id: mongojs.ObjectId(request.params.id)}, 
                    {$set: 
                        {title: book.title, category: book.category, 
                        author: book.author, synopsis: book.synopsis, 
                        available: book.available}
                    }, {}, function(error, Book){
                if(error){
                // response.render("error.html");
            }
            response.send(request.params.id);
            })
        } else {
            response.json({
                success: true, 
                message: "This book doesn't exist"
            })
        }
    }

});

// Add Category
apiRouter.route("/add-category").post(function(request, response){
    if(request.session.account == "adminAccount"){
        var category = request.body;
        if(!category.title){
            response.json({
                "error": "Enter Category title"
            })
        } else {
            db.categories.save(category, function(err, category){
                if(err){
                    response.send(err);
                }
                response.send(category._id);
            })
        }
    }
});

// Borrow book
apiRouter.route("/borrow-book/:id").put(function(request, response){
    var book = request.body;
    var borrowBook = 1;
    var now = new Date();
    now.setDate(now.getDate()+3);

    // borrowBook.returnDate = now;
    db.books.update({_id: mongojs.ObjectId(request.params.id)}, {$set: {borrow: borrowBook}}, {}, function(error, Book){
        if(error){
        // response.render("error.html");
        }
    });
    response.send(request.params.id);
});

// Return book
apiRouter.route("/return-book/:id").put(function(request, response){
    if(request.session.account == "adminAccount"){
        var book = request.body;
        var borrowBook = 0;
        var now = new Date();
        now.setDate(now.getDate()+3);

        // borrowBook.returnDate = now;
        db.books.update({_id: mongojs.ObjectId(request.params.id)}, {$set: {borrow: borrowBook}}, {}, function(error, Book){
            if(error){
            // response.render("error.html");
            }
        });
        response.send(request.params.id);
    }
});

// Get all users
apiRouter.route("/users").get(function(request, response) {
  db.users.find({}, function(error, users) {
    response.json(users);
  });
}); 

module.exports = apiRouter;
