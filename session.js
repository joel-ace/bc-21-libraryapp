"use strict"

var session = require('express-session');
var express = require('express');
var app = express();

app.use(session({secret: "MyJSAppSecret", saveUninitialized: true, resave: true}));

var sessID = 1;

