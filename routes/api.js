var express = require("express");
var apiRouter = express.Router();
var mongojs = require("mongojs");
var jsonwebtoken = require("jsonwebtoken");
var logic = require("../functions");
var bcrypt = require('bcrypt');

var secret = "myfirstjavascriptappever";

var db = mongojs("mongodb://libUser:qwerty1234@ds031551.mlab.com:31551/library", ["books", "categories", "users"]);

// Authenticate User
apiRouter.route("/authenticate").post(function(request, response){
    db.users.findOne({email: request.body.email}, function(error, User){
        if(!error){
            if(!User){
                response.json({
                    success: false, 
                    message: "We couldn't find any user with the details you provided",
                });                
            } else {
                bcrypt.compare(request.body.password, User.password, function(err, res) {
                    if(res == true){
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
                    } else {
                        response.json({
                            success: false, 
                            message: "This password is incorrect",
                        });                
                    }
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
        
        //encrypt the user password
        bcrypt.hash(user.password, 10, function(err, hash) {
            user.password = hash;

            db.users.save(user, function(error, User){
                if(error){
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
        });


    }
});

// Add Book
apiRouter.route("/add-book").post(function(request, response){
    if(request.session.account == "adminAccount"){
        var book = request.body;
        if(!book.title || !book.available){
            response.json({
                success: false, 
                message: "Enter book tile and book availablitity status"
            })
        } else {
            db.books.save(book, function(err, book){
                if(err){
                    response.json({
                        success: false, 
                        message: "Sorry, we couldn't add Book"
                    })
                } else {
                    response.json({
                        success: true, 
                        message: "Book added Sucessfully"
                    })
                }
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
            updateBook.catName = book.catName,
            updateBook.author = book.author,
            updateBook.synopsis = book.synopsis,
            updateBook.borrow = book.borrow,
            updateBook.available = book.available

            db.books.update({_id: mongojs.ObjectId(request.params.id)}, 
                    {$set: {
                            title: book.title, category: book.category, 
                            author: book.author, synopsis: book.synopsis, 
                            available: book.available, borrow: book.borrow, 
                            catName: book.catName
                            }
                    }, {}, function(error, Book){
                        response.json({
                            success: true, 
                            message: "Book updated Sucessfully"
                        })
            })
        } else {
            response.json({
                success: false, 
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
                success: false, 
                message: "Enter Category Title"
            })
        } else {
            db.categories.save(category, function(err, category){
                if(err){
                    response.json({
                        success: false, 
                        message: "Couldn't add category"
                    })
                } else {
                    response.json({
                        success: true, 
                        message: "Caregory added Sucessfully"
                    })
                }
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
    returnDate = now;

    db.books.update({_id: mongojs.ObjectId(request.params.id)}, {$set: {borrow: borrowBook}}, {}, function(error, Book){
        if(error){
            response.json({
                success: false, 
                message: "Seems there's a glitch in the system"
            })
        } else {
            var msg = "Book Borrowed sucessfully. Return it on or before " + returnDate + " else you'll be surcharged";
            response.json({
                success: true, 
                message: msg
            })
        }
    });
});

// Return book
apiRouter.route("/return-book/:id").put(function(request, response){
    if(request.session.account == "adminAccount"){
        var book = request.body;
        var borrowBook = 0;
        var now = new Date();
        now.setDate(now.getDate()+3);

        db.books.update({_id: mongojs.ObjectId(request.params.id)}, {$set: { borrow: borrowBook }}, {}, function(error, Book){
            if(error){
                response.json({
                    success: false, 
                    message: "Seems there's a glitch in the system"
                })
            } else {
                response.json({
                    success: true, 
                    message: "Book has been marked as returned"
                })
            }
        });
    }
});

// Get all users
apiRouter.route("/users").get(function(request, response) {
  db.users.find({}, function(error, users) {
    response.json(users);
  });
}); 

module.exports = apiRouter;
