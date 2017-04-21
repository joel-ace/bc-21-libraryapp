var express = require("express");
var router = express.Router();

router.get("/", function(request, response){

    var Sess = { 
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }
    
    response.render("login.ejs", { Sess: Sess});
});

router.get("/register", function(request, response){
    var Sess = { 
        SSuser: request.session.user, 
        SSname: request.session.name, 
        SSaccount: request.session.account
    }

    response.render("register.ejs", {Sess: Sess});
});



module.exports = router;