<?php
//this php helps to return a list of events associated with a certain user
  require 'database.php';
  header("Content-Type: application/json");
	ini_set("session.cookie_httponly", 1);
  session_start();

  if(isset($_SESSION["username"])){
      $username= $mysqli->real_escape_string($_SESSION["username"]);
  }
  else {
      echo json_encode(array(
      	"success" => false,
        "message" => "Not logged in."
      ));
      exit;
  }
  $year=$mysqli->real_escape_string(trim($_POST['year']));
  $month=$mysqli->real_escape_string(trim($_POST['month']));

  //all the events associated with the user
	$total_events = [];

	$stmt = $mysqli->prepare("SELECT id, title, minute, hour, day, tag FROM events WHERE username=? AND year=? AND month=?");
	if(!$stmt){
		printf("Query Prep Failed: %s\n", $mysqli->error);
		exit();
	}
	$stmt -> bind_param('sss',$username,$year,$month);
	$stmt -> execute();
	$stmt -> bind_result($event_id,$title, $minute, $hour, $day, $tag);

	while ($stmt->fetch()){
		array_push($total_events, array(
      "event_id" => htmlentities($event_id),
      "title" => htmlentities($title),
      "minute" => htmlentities($minute),
      "hour" => htmlentities($hour),
      "day" => htmlentities($day),
      "tag" => htmlentities($tag)
		));
	}

	echo json_encode(array(
		"success" => true,
		"all_events" => $total_events
	));
	exit;
?>
