"use strict"

var express = require("express");
var path =  require("path");
var bodyParser = require("body-parser");

var app = express();
var port = 4000;



var index = require("./routes/index");
var books = require("./routes/bookRoutes");
var login = require("./routes/login");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// Set Static folder for bootstrap and jquery
app.use(express.static(path.join(__dirname, "assets")));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routing
app.use("/", index);
app.use("/books", books);
app.use("/login", login);

app.listen(port, function () {
  console.log('App running')
})