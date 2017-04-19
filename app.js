"use strict"

var express = require("express");

var app = express();
var port = 3000;

app.use(express.static("assets"))

app.get("/", function (request, response) {
  response.send('test Pages')
})

app.get("/login", function (request, response) {
  response.send('test Pages')
})

app.listen(port, function () {
  console.log('App running')
})