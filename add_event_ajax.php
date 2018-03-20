<?php
// login_ajax.php
	require 'database.php';
  ini_set("session.cookie_httponly", 1);
  session_start();
	header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

  if (isset($_SESSION['username'])) {
  		$username = $mysqli->real_escape_string($_SESSION['username']);
  } else {
    exit;
  }
	$month = $mysqli->real_escape_string(trim($_POST['month']));
	$title = $mysqli->real_escape_string(trim($_POST['title']));
	$year = $mysqli->real_escape_string(trim($_POST['year']));
	$hour = $mysqli->real_escape_string(trim($_POST['hour']));
	$minute = $mysqli->real_escape_string(trim($_POST['minute']));
	$day = $mysqli->real_escape_string(trim($_POST['day']));
	$tag = $mysqli->real_escape_string(trim($_POST['tag']));

	$stmt = $mysqli->prepare("insert into events(username,title,year,month,minute,hour,day,tag) values(?,?,?,?,?,?,?,?)");
	// Bind the parameter
	$stmt->bind_param('ssssssss', $username,$title,$year,$month,$minute,$hour,$day,$tag);
	if (!$stmt->execute()){
		echo json_encode(array(
			"success" => false,
			"message" => "Not valid event."
		));
		$stmt->close();
		exit;
	} else {
		$stmt->close();
		echo json_encode(array(
			"success" => true
  	));
		exit;
	}
?>
