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
	$shared_user = $mysqli->real_escape_string(trim($_POST['shared_user']));

  //obtaining author's list of events
  $total_events = [];

  $stmt = $mysqli->prepare("SELECT title, year, month, minute, hour, day FROM events WHERE username=?");
  if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit();
  }
  $stmt -> bind_param('s',$username);
  $stmt -> execute();
  $stmt -> bind_result($title, $year, $month, $minute, $hour, $day);

  while ($stmt->fetch()){
    array_push($total_events, array(
      "title" => htmlentities($title),
      "minute" => htmlentities($minute),
      "hour" => htmlentities($hour),
      "day" => htmlentities($day),
			"year" => htmlentities($year),
			"month" => htmlentities($month)
    ));
  }
	$stmt->close();

	//representing shared events
	$tag = 'N';

	//adding list of events to the new user


	if (count($total_events) == 0){
		echo json_encode(array(
			"success" => true
		));
		exit;
	}

	$stmt = $mysqli->prepare("insert into events(username,title,year,month,minute,hour,day,tag) values(?,?,?,?,?,?,?,?)");

	foreach($total_events as $event){
		// Bind the parameter
		$stmt->bind_param('ssssssss', $shared_user,$event["title"],$event["year"],$event["month"],$event["minute"],$event["hour"],$event["day"],$tag);
		if (!$stmt->execute()){
			$stmt->close();
			echo json_encode(array(
				"success" => false,
				"message" => "No such user"
			));
			exit;
		}
	}
		$stmt->close();
		echo json_encode(array(
			"success" => true
		));
		exit;
?>
