$(document).ready(function(){
  
var alertWrapper = $("#alertWrap");
  
    // Add Book
    var addBookForm = $("form#add-book");
    sendRequest("/api/add-book", addBookForm, "POST");

    // Add Category
    var addCategory = $("form#add-category");
    sendRequest("/api/add-category", addCategory, "POST");

    // Edit Book
    var editBook = $("form#edit-book");
    var hiddenField = $("#catName");
    var editID = editBook.data("id");
    $("#category").on('change', function() {
        $this = $(this);
        var select =  $this.val();
        catName = $("#category option[value=" + select +"]").text();
        hiddenField.val(catName);
    })
    sendRequest("/api/update-book/"+editID, editBook, "PUT");

    //Delete Book
    var deleteBook = $(".deleteBook");
    // sendRequest("/api/delete-book/"+deleteID, deleteBook, "DELETE");
    deleteBook.click(function(e){
    	e.preventDefault();
    	$this = $(this);
        var deleteID = deleteBook.data("id");
        url = "/api/delete-book/"+deleteID;
        trRemove = "tr#" + deleteID;

        $.ajax({
            type: "DELETE",
            url: url,
            data: {},
            contentType: "application/json; charset=utf-8",
            success: function(msg) {
                if(msg.success == true){
                    if(alertWrapper.hasClass("alert")) {
                        alertWrapper.attr("class","");
                    }
                    $(trRemove).fadeOut("fast", function(){
                        $(trRemove).remove();
                    });
                    alertWrapper.addClass("alert alert-success").text(msg.message);
                }
            }
        });
    });


    // Borrow Book
    var borrowBtn = $(".borrow");
    borrowBtn.click(function(e){
    	e.preventDefault();
    	$this = $(this);
        var bookID = $this.data("id");
        url = "/api/borrow-book/"+bookID;

        $.ajax({
            type: "PUT",
            url: url,
            data: {},
            contentType: "application/json; charset=utf-8",
            success: function(msg) {
                if(msg.success == true){
                    if(alertWrapper.hasClass("alert")) {
                        alertWrapper.attr("class","");
                    }
                    alertWrapper.addClass("alert alert-success").text(msg.message);
                    $this.fadeOut("slow", function(){
                        $this.remove();
                    });
                }  else {
                    alertWrapper.addClass("alert alert-danger").text(msg.message);
                }              
            }
        });
    });

    // Mark as Returned
    var returnedBtn = $(".returned");
    returnedBtn.click(function(e){
    	e.preventDefault();
    	$this = $(this);
        var bookID = $this.data("return");
        url = "/api/return-book/"+bookID;

        $.ajax({
            type: "PUT",
            url: url,
            data: {},
            contentType: "application/json; charset=utf-8",
            success: function(msg) {
                if(msg.success == true){
                    $this.fadeOut("slow", function(){
                        $this.remove();
                    });
                    alertWrapper.addClass("alert alert-success").text(msg.message);
                }
            }
        });
    });

    // Login
    var returnedBtn = $("form#login");
    returnedBtn.submit(function(e){
    	e.preventDefault();

    	$this = $(this);
        var alertWrapper = $("#fontAwesomeSpinner");
        alertWrapper.removeClass("hide").addClass("show");

        var data = formToJson($this);
        url = "/api/authenticate";

        $.ajax({
            type: "POST",
            url: url,
            data: data,
            contentType: "application/json; charset=utf-8",
            success: function(msg) {
                if(msg.success == true){
                    window.location = msg.url;
                } else {
                    alertWrapper.addClass("alert alert-danger").text(msg.message);
                }
            }
        });
    });

    // Register
    var registerBtn = $("form#register");
    sendRequest("/api/add-user", registerBtn, "POST");

    function formToJson(formData){
        var formObject = formData.serializeArray();
        var newFormObj = {};
        for(var i = 0; i < Object.keys(formObject).length; i++){
            newFormObj[formObject[i]["name"]] = formObject[i]["value"];
        }
        return JSON.stringify(newFormObj);
    }

    function sendRequest(url, form, method){
        form.submit(function(e){
            $this = $(this)
            e.preventDefault();
            var data = formToJson(form);

            // Send Post request
            $.ajax({
                type: method,
                url: url,
                data: data,
                contentType: "application/json; charset=utf-8",
                success: function(msg) {
                    // Check if an div with class alert already exists in the dom and remove the class
                    if(alertWrapper.hasClass("alert")) {
                        alertWrapper.attr("class","");
                    }
                    // Check response and display alert
                    if(msg.success == true){
                        alertWrapper.addClass("alert alert-success").text(msg.message);
                        if(msg.url){
                            window.location = msg.url; 
                        }

                        // Check if the form processed is the remove book form and remove the book entry from the dom
                        if($this.attr("id") == "deleteBook") {
                            //get the table Id based on the url passed
                            remTableId = url.substr(url.lastIndexOf('/') + 1);
                            remTable = $('table.manageBooks tr#'+remTableId);
                            remTable.fadeOut("slow", function(){
                                remTable.remove();
                            })
                        } else if($this.attr("id") == "add-book" || $this.attr("id") == "add-category") {
                            // Clear all form inputs
                            $(':input', $this)
                            .not(':button, :submit, :reset, :hidden')
                            .val('')
                            .removeAttr('checked')
                            .removeAttr('selected');                        }
                    } else if(msg.success == false) {
                        // Check if an div with class alert already exists in the dom and remove the class
                        if(alertWrapper.hasClass("alert")) {
                            alertWrapper.attr("class","");
                        }
                        
                        alertWrapper.addClass("alert alert-danger").text(msg.message);
                    }
                }
            });           
        });
    }

});

