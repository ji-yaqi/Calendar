//authorization:
//check whether user is logged in and display the necessary html elements

var dataAuthString = "";
var xmlHttp = new XMLHttpRequest();
xmlHttp.open("POST", "auth.php", true);
xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xmlHttp.addEventListener("load", function(event){
	var jsonData = JSON.parse(event.target.responseText);
	if(jsonData.success){
		$("#user_display").html("Hello, ");
		$("#user_display").append(jsonData.username);
		$("#login").hide();
		$("#logout").show();
		updateCalendar();
		displayEvent();
		$("#add_event").show();
		$("#shareEvents").show();
	}else{
		$("#user_display").html("Hi, please log in");
		$("#login").show();
		$("#logout").hide();
		updateCalendar();
		$("#add_event").hide();
		$("#shareEvents").hide();
	}
}, false);
xmlHttp.send(dataAuthString);



function loginAjax(event){
	var username = document.getElementById("username").value; // Get the username from the form
	var password = document.getElementById("password").value; // Get the password from the form

	var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "login_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function(event){
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.success){
			$("#user_display").html("Hello, ");
			$('#token').val(jsonData.token);
			$("#user_display").append(jsonData.username);
			$("#login").hide();
			$("#logout").show();
			$("#add_event").show();
			$("#shareEvents").show();
			updateCalendar();
			displayEvent();
		}else{
			alert("You were not logged in.  "+jsonData.message);
		}
	}, false);
	xmlHttp.send(dataString);
}

document.getElementById("login_btn").addEventListener("click", loginAjax, false); // Bind the AJAX call to button click

function registerAjax(event){
	var username = document.getElementById("username").value; // Get the username from the form
	var password = document.getElementById("password").value; // Get the password from the form
	var dataString = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "register_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function(event){
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.success){
			$("#user_display").html("Hello, ");
			$("#user_display").append(jsonData.username);
			$("#login").hide();
			$("#logout").show();
			$("#add_event").show();
			$("#shareEvents").show();
			$('#token').val(jsonData.token);
			updateCalendar();
			displayEvent();
		}else{
			alert("You were not registered.  "+jsonData.message);
		}
	}, false);
	xmlHttp.send(dataString);
}
document.getElementById("register_btn").addEventListener("click", registerAjax, false); // Bind the AJAX call to button click

function logoutAjax(event){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "logout_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function(event){
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.success){
			$("#user_display").html("Hi, please log in");
			$("#login").show();
			$("#logout").hide();
			$(".events_display").html("");
			$("#add_event").hide();
			$("#shareEvents").hide();
			$('#token').val("");
		}else{
			alert("You were not logged out.  "+jsonData.message);
		}
	}, false);
	xmlHttp.send();
}
document.getElementById("logout_btn").addEventListener("click", logoutAjax, false); // Bind the AJAX call to button click


function addEventAjax(event){
	//0 to 11
	var month = currentMonth.month;
	var year = currentMonth.year;
	var day = document.getElementById("day").value;
	var title = document.getElementById("title").value;
	var hour = document.getElementById("hour").value;
	var minute = document.getElementById("minute").value;
	var tag = document.getElementById("tag").value;
	var dataString = "title=" + encodeURIComponent(title) + "&tag=" + encodeURIComponent(tag) + "&year=" + encodeURIComponent(year)+"&day=" + encodeURIComponent(day)+"&month=" + encodeURIComponent(month)+"&hour=" + encodeURIComponent(hour)+ "&minute=" + encodeURIComponent(minute);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "add_event_ajax.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function(event){
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.success){
			updateCalendar();
			displayEvent();
		}else{
			alert("Failed to add new event.  "+jsonData.message);
		}
	}, false);
	xmlHttp.send(dataString);
}
document.getElementById("add_event_btn").addEventListener("click", addEventAjax, false); // Bind the AJAX call to button click

function addGroupEventAjax(event){
	//0 to 11
	var month = currentMonth.month;
	var year = currentMonth.year;
	var day = document.getElementById("day").value;
	var title = document.getElementById("title").value;
	var hour = document.getElementById("hour").value;
	var minute = document.getElementById("minute").value;
	var tag = document.getElementById("tag").value;
	var dataString = "title=" + encodeURIComponent(title) + "&tag=" + encodeURIComponent(tag) + "&year=" + encodeURIComponent(year)+"&day=" + encodeURIComponent(day)+"&month=" + encodeURIComponent(month)+"&hour=" + encodeURIComponent(hour)+ "&minute=" + encodeURIComponent(minute);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "add_group_event.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function(event){
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.success){
			updateCalendar();
			displayEvent();
		}else{
			alert("Failed to add new event.  "+jsonData.message);
		}
	}, false);
	xmlHttp.send(dataString);
}
document.getElementById("add_as_group_btn").addEventListener("click", addGroupEventAjax, false); // Bind the AJAX call to button click

function edit_event(event_id){
	var token = $('#token').val();
	var title = document.getElementById("e_title"+event_id).value;
	var day = document.getElementById("e_day"+event_id).value;
	var hour = document.getElementById("e_hour"+event_id).value;
	var minute = document.getElementById("e_minute"+event_id).value;
	var dataString = "event_id=" + encodeURIComponent(event_id) + "&title=" + encodeURIComponent(title) + "&day=" + encodeURIComponent(day)+ "&hour=" + encodeURIComponent(hour)+ "&minute=" + encodeURIComponent(minute)+ "&token=" + encodeURIComponent(token);
	var xmlHttp = new XMLHttpRequest();
	console.log(dataString);
	xmlHttp.open("POST", "edit_event.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function(event){
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.success){
			updateCalendar();
			displayEvent();
		}else{
			alert("You were not able to edit.  "+jsonData.message);
		}
	}, false);
	xmlHttp.send(dataString);
}

function delete_event(event_id){
	var token = $('#token').val();
	var dataString = "event_id=" + encodeURIComponent(event_id)+"&token=" + encodeURIComponent(token);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "delete_event.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function(event){
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.success){
			updateCalendar();
			displayEvent();
		}else{
			alert("Failed to delete an event.  "+jsonData.message);
		}
	}, false);
	xmlHttp.send(dataString);
}


function share_events(){
	if (document.getElementById("share_username")){
		var shared_user = document.getElementById("share_username").value;
	}
	var dataString = "shared_user=" + encodeURIComponent(shared_user);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", "share_events.php", true);
	xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xmlHttp.addEventListener("load", function(event){
		var jsonData = JSON.parse(event.target.responseText);
		if(jsonData.success){
			updateCalendar();
			displayEvent();
		}else{
			alert("Failed to share events.  "+jsonData.message);
		}
	}, false);
	xmlHttp.send(dataString);
}
