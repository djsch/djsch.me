<?php

//error_reporting(-1); // reports all errors
//ini_set("display_errors", "1"); // shows all errors
//ini_set("log_errors", 1);
//ini_set("error_log", "/tmp/php-error.log");

$q = $_REQUEST["q"];

$configs = include('sql_info.php');
//echo $configs;
//exit

$con = mysqli_connect($configs['host'], $configs['username'], $configs['pwd'], $configs['db_name']);

if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($con,"mtgbracket_dev");
$sql="SELECT * FROM mtgbracket_dev WHERE name = '$q'";
$result = mysqli_query($con,$sql);

$array = mysqli_fetch_row($result);

echo json_encode($array);

mysqli_close($con);
exit;

?>
