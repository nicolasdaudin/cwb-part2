// Userlist data array for filling in info box
var userListData = [];

// DOM READY =======
$(document).ready(function(){
	// Populate the user table on initial page load
	populateTable();

	// Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click',addUser);

	// Add User button click
    $('#btnEditUser').on('click',editUser);
    
    // Edit User link click
    $('#userList table tbody').on('click', 'td a.linkedituser', showEditUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    $('#editUser').hide();
});

// Functions ============

// Fill table with data
function populateTable(){
	
	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON('/users/userlist',function(data){


		console.log('**** userListData ****');
		console.log(data);
		userListData = data;

    	// For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on name value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);


    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);

};

function showEditUser(event){
	event.preventDefault();

	//$('#addUser').hide();
	$('#editUser').show();

	console.log("showEditUser");

    // Retrieve username from link rel attribute
    var thisId = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisId);


    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#editUser fieldset input#inputUserId').val(thisUserObject._id);
    $('#editUser fieldset input#inputUserName').val(thisUserObject.username);
	$('#editUser fieldset input#inputUserEmail').val(thisUserObject.email);
    $('#editUser fieldset input#inputUserFullname').val(thisUserObject.fullname);
    $('#editUser fieldset input#inputUserAge').val(thisUserObject.age);
    $('#editUser fieldset input#inputUserGender').val(thisUserObject.gender);
    $('#editUser fieldset input#inputUserLocation').val(thisUserObject.location);

}

// Edit User
function editUser(event){
	event.preventDefault();

	console.log('editUser');

	// Super basic validation - increase errorCount variable if any fieleds are blank
	var errorCount = 0;
	$('#editUser input').each(function(index,val){
		if ($(this).val() === ''){ errorCount ++;}
	});

	// Check and makre sure errorCount's still at zero
	if (errorCount === 0){

		// If it is, compile all user info into one object
		var updatedUser = {
			'_id' : $('#editUser fieldset input#inputUserId').val(),
            'username': $('#editUser fieldset input#inputUserName').val(),
            'email': $('#editUser fieldset input#inputUserEmail').val(),
            'fullname': $('#editUser fieldset input#inputUserFullname').val(),
            'age': $('#editUser fieldset input#inputUserAge').val(),
            'location': $('#editUser fieldset input#inputUserLocation').val(),
            'gender': $('#editUser fieldset input#inputUserGender').val()
        }

        console.log('updatedUser._id : ' + updatedUser._id);

        // Use AJAX to put the object to our edit user service
        $.ajax({
        	type: 'PUT',
        	data: updatedUser,
        	url: '/users/edituser',
        	dataType : 'JSON'
        }).done(function(response){
        	// Check for successful (blank) response
        	if (response.msg === ''){

        		// Clear the form inputs
        		$('#editUser fieldset input').val('');
        		// Hide edit form
        		$('#editUser').hide();

        		// Update the table
        		populateTable();
        	} else {
        		// If something goes wrong, alert the error message that our service returned
        		alert('Error : ' + response.msg);
        	}
        });

	} else {
		// if Errorcount is more than 0, error out
		alert ('Please fill in all fields');
		return false;
	}

};

// Add User
function addUser(event){
	event.preventDefault();

	// Super basic validation - increase errorCount variable if any fieleds are blank
	var errorCount = 0;
	$('#addUser input').each(function(index,val){
		if ($(this).val() === ''){ errorCount ++;}
	});

	// Check and makre sure errorCount's still at zero
	if (errorCount === 0){

		// If it is, compile all user info into one object
		var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
        	type: 'POST',
        	data: newUser,
        	url: '/users/adduser',
        	dataType : 'JSON'
        }).done(function(response){
        	// Check for successful (blank) response
        	if (response.msg === ''){

        		// Clear the form inputs
        		$('#addUser fieldset input').val('');

        		// Update the table
        		populateTable();
        	} else {
        		// If something goes wrong, alert the error message that our service returned
        		alert('Error : ' + response.msg);
        	}
        });

	} else {
		// if Errorcount is more than 0, error out
		alert ('Please fill in all fields');
		return false;
	}

};

// Delte User
function deleteUser(event){
	event.preventDefault();

	// Pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this user?');

	// Check and make sure the user confirmed
	if (confirmation === true){
		// If they did, do our delete
		$.ajax({
			type : 'DELETE',
			url : '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response){
			// Check for a successful (blank) respone
			if (response.msg === ''){

			} else {
				alert('Error : ' + response.msg);
			}

			// Update the table
			populateTable();
		});

	} else {
		// If they said no to the confirm, do nothing
		return false;
	}
};



