<?php
// login_ajax.php
	require 'database.php';
	ini_set("session.cookie_httponly", 1);
	header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

	$username = $mysqli->real_escape_string(trim($_POST['username']));
	if( !preg_match('/^[\w_\.\-]+$/', $username) ){
		echo json_encode(array(
			"success" => false,
			"message" => "Invalid Username"
		));
		exit;
	}
	$pwd_guess = $mysqli->real_escape_string(trim($_POST['password']));

	// Use a prepared statement
	$stmt = $mysqli->prepare("SELECT COUNT(*), password_hashed FROM users WHERE username=?");
	// Bind the parameter
	$stmt->bind_param('s', $username);
	$stmt->execute();
	// Bind the results
	$stmt->bind_result($cnt, $pwd_hash);
	$stmt->fetch();
	$stmt->close();
	// Compare the submitted password to the actual password hash

	if($cnt == 1 && password_verify($pwd_guess, $pwd_hash)){
		// Login succeeded!
		session_start();
		$_SESSION['username'] = $username;
		$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); // generate a 32-byte random string
		echo json_encode(array(
			"success" => true,
			"username" => $_SESSION['username'],
			"token" => $_SESSION['token']
		));
		exit;
	} else{
		echo json_encode(array(
			"success" => false,
			"message" => "Incorrect Username or Password"
		));
		exit;
	}
?>
