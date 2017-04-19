var express = require("express");
var adminRouter = express.Router();

adminRouter.route("/").get(function(request, response){
    // response.render("login.html");
});

adminRouter.route("/booksa").get(function(request, response){
    // response.render("login.html");
})
