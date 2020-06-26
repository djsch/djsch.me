<?php

//error_reporting(-1); // reports all errors
//ini_set("display_errors", "1"); // shows all errors
//ini_set("log_errors", 1);
//ini_set("error_log", "/tmp/php-error.log");

//$q = $_REQUEST["q"];

$configs = include('sql_info.php');
$con = mysqli_connect($configs['host'], $configs['username'], $configs['pwd'], $configs['db_name']);

if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($con,"mtgbracket_dev");
$sql="SELECT string FROM compressed_bracket WHERE name = 'compressed_string'";
//$sql="SELECT string FROM compressed_bracket_test WHERE name = 'compressed_string'";
$result = mysqli_query($con,$sql);

//$array = mysqli_fetch_row($result);
//echo json_encode($array);

// TODO: change the whole database structure so that we don't need to get
// extraneous columns.
$json = mysqli_fetch_all ($result, MYSQLI_ASSOC);
echo json_encode($json );

mysqli_close($con);
exit;
?>
