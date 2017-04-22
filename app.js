"use strict"

var express = require("express");
var path =  require("path");
var bodyParser = require("body-parser");
var session = require('express-session');

var app = express();
var port = 8000;

//Sessions
app.use(session({secret: "MyJSAppSecret", saveUninitialized: true, resave: true}));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

var index = require("./routes/index");
var books = require("./routes/bookRoutes");
var adminRoute = require("./routes/adminRoutes");
var category = require("./routes/category");
var api = require("./routes/api");
var login = require("./routes/login");

// Set Static folder for bootstrap and jquery
app.use(express.static(path.join(__dirname, "assets")));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var isLoggedIn = function(request, response, next){
    if(request.session.user){
        return next();
    } else {
        response.redirect("/login");
    }
} 
app.get("/", function(request, response){
    response.redirect("/books");
});
app.use("/books", isLoggedIn, books);
app.use("/admin", isLoggedIn, adminRoute);
app.use("/category", isLoggedIn, category);
app.use("/api", api);
app.use("/login", login); 
app.get("/register", function(request, response){
    response.render("register.ejs");
});


app.get("/logout",function(request,response){
    request.session.destroy(function(error){
        if(error){
            console.log(err);
        } else {
            response.redirect("/login");
        }
    });
});

app.listen(port, function () {
  console.log("App running")
})

