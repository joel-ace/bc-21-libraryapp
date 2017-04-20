$(document).ready(function(){
    var addBookForm = $("form#add-book");

    addBookForm.submit(function(e){
        e.preventDefault();
        var data = formToJson(addBookForm);
    });


    function formToJson(formData){
        var formObject = formData.serializeArray();
        var newFormObj = {};
        for(var i = 0; i < Object.keys(formObject).length; i++){
            newFormObj[formObject[i]["name"]] = formObject[i]["value"];
        }
       return newFormObj;
    }

});

