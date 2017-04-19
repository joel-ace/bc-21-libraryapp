var express = require("express");
var adminRouter = express.Router();
// var mongodb= require("mongodb").MongoClient;

var books = [
    {
        title: "Things Fall Apart",
        category: "Nigerian",
        author: "Chinua Achebe",
        available: true
    },
    {
        title: "The God's are not to be blamed",
        category: "Thriller",
        author: "Ola Rotimi",
        available: false
    },
    {
        title: "Emeka",
        category: "Biography",
        author: "Author Name",
        available: false
    }
]



adminRouter.route("/").get(function(request, response){
    response.render("login.html");
});
adminRouter.route("/add-book").get(function(request, response){
    // var dbURL = "mongodb://localhost:27017/libraryapp";
    // mongodb.connect(dbURL, function(error, db){
    //     var bookBollection = db.collection("books");
    //     collection.insertMany(books, function(err, results){
    //         res.send(results);
    //         db.close();
    //     })
    // });
    // response.send("Inserting books");
});

module.exports = adminRouter;
