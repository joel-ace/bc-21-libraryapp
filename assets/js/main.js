$(document).ready(function(){
    // Add Book
    var addBookForm = $("form#add-book");
    sendRequest("/api/add-book", addBookForm, "POST");

    // Add Category
    var addCategory = $("form#add-category");
    sendRequest("/api/add-category", addCategory, "POST");

    // Edit Book
    var editBook = $("form#edit-book");
    var editID = editBook.data("id");
    sendRequest("/api/update-book/"+editID, editBook, "PUT");

    //Delete Book
    var deleteBook = $("form#deleteBook");
    var deleteID = deleteBook.data("id");
    sendRequest("/api/delete-book/"+deleteID, deleteBook, "DELETE");

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
            e.preventDefault();
            var data = formToJson(form);
            var alertWrapper = $("#alertWrap");

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
                    if(msg && msg.length > 5){
                        alertWrapper.addClass("alert alert-success").text("Successfully Added");
                        // Check if the form processed is the remove book form and remove the book entry from the dom
                        if(form.attr("id") == "deleteBook") {
                            //get the table Id based on the url passed
                            remTableId = url.substr(url.lastIndexOf('/') + 1);
                            remTable = $('table.manageBooks tr#'+remTableId);
                            remTable.fadeOut("slow", function(){
                                remTable.remove();
                            })
                        } else if(form.attr("id") == "add-book" || form.attr("id") == "add-category") {
                            // Clear all form inputs
                            $(':input', form)
                            .not(':button, :submit, :reset, :hidden')
                            .val('')
                            .removeAttr('checked')
                            .removeAttr('selected');                        }
                    } else {
                        alertWrapper.addClass("alert alert-danger").text(msg.error);
                    }
                }
            });           
        });
    }

});

