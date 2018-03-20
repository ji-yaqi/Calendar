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

  $event_id = $mysqli->real_escape_string((int)trim($_POST['event_id']));

	$stmt = $mysqli->prepare("delete from events where id = ?");
	// Bind the parameter
	$stmt->bind_param('s', $event_id);
	if (!$stmt->execute()){
		echo json_encode(array(
			"success" => false,
			"message" => "Cannot delete."
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
