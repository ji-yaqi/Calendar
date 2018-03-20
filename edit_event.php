<?php
// login_ajax.php
	require 'database.php';
  ini_set("session.cookie_httponly", 1);
  session_start();
	header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

	if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
	}


  if (isset($_SESSION['username'])) {
  		$username = $mysqli->real_escape_string($_SESSION['username']);
  } else {
    exit;
  }

  $event_id = $mysqli->real_escape_string(trim($_POST['event_id']));
  $title = $mysqli->real_escape_string(trim($_POST['title']));
  $day = $mysqli->real_escape_string(trim($_POST['day']));
  $hour = $mysqli->real_escape_string(trim($_POST['hour']));
  $minute = $mysqli->real_escape_string(trim($_POST['minute']));

	$stmt = $mysqli->prepare("update events set title=?,day=?,hour=?,minute=? where id=?");
	// Bind the parameter
	$stmt->bind_param('sssss',$title,$day,$hour,$minute,$event_id);
	if (!$stmt->execute()){
		echo json_encode(array(
			"success" => false,
			"message" => "Not able to update event."
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
