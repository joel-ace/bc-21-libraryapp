var express = require("express");
var bookRouter = express.Router();

bookRouter.route("/").get(function(request, response){
    response.render("books.html");
});

bookRouter.route("/booksa").get(function(request, response){
    response.render("login.html");
})


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

module.exports = bookRouter;