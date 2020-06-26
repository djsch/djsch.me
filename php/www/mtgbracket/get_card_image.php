<?php
//error_reporting(-1); // reports all errors
//ini_set("display_errors", "1"); // shows all errors
//ini_set("log_errors", 1);
//ini_set("error_log", "/tmp/php-error.log");

$q = $_REQUEST["q"];
$return = array();

$query_url = "https://api.scryfall.com/cards/named?exact=";
$query_url .= $q;
$json = file_get_contents($query_url);

$data = json_decode($json);
$uri = $data->image_uris->normal;
array_push($return, $uri);
/*
$configs = include('sql_info.php');
$con = mysqli_connect($configs['host'], $configs['username'], $configs['pwd'], $configs['db_name']);
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($con,"mtgbracket_dev");
$sql="SELECT image_uri FROM image_uris WHERE name = '$q'";
$result = mysqli_query($con,$sql);
*/
//$array = mysqli_fetch_row($result);
echo json_encode($return);

//mysqli_close($con);
exit;
?>
