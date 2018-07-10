<?php
error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

$q = $_REQUEST["q"];

// Maybe this would be easier with 8 different files, since the seeding won't return seeds 1-32, etc
//$myfile = fopen("bracket_128/seeded_128_test.txt", "r") or die("Unable to open file!");
$myfile = fopen("bracket_128/seeded_128.txt", "r") or die("Unable to open file!");

$return = array();

$lower_bound = -1;
$upper_bound = 129;
if ($q != "all") {
	$lower_bound = 16 * $q;
	$upper_bound = $lower_bound + 16;
}

$count = 0;
while (!feof($myfile)) {
	$card = fgets($myfile);
	$card = trim($card);

	if ($count < $lower_bound || $count >= $upper_bound) {
		$count = $count + 1;
		continue;
	}
	
	array_push($return, $card);

	$count = $count + 1;
}

fclose($myfile);

echo json_encode($return);

exit
?>
