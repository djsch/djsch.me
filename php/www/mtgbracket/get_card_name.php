<?php
error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

$q = $_REQUEST["q"];

$myfile = fopen("card_names/card_names.txt", "r") or die("Unable to open file!");

$return = array();

while (!feof($myfile)) {
	$card = fgets($myfile);
	$card = trim($card);
	// Break on exact match.
	if (strcasecmp($card, $q) == 0) {
		$return = array();
		array_push($return, $card);
		break;
	}
	if (strcasecmp(substr($card, 0, strlen($q)), $q) == 0) {
		array_push($return, $card);
	}
}

fclose($myfile);

echo json_encode($return);

exit
?>
