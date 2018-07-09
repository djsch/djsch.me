<?php

error_reporting(-1); // reports all errors
ini_set("display_errors", "1"); // shows all errors
ini_set("log_errors", 1);
ini_set("error_log", "/tmp/php-error.log");

//var_dump($_POST);

$p = $_POST["bracket"];
$name = $_POST["name"];

//echo $p;
//echo $name;

$configs = include('sql_info.php');
$con = mysqli_connect($configs['host'], $configs['username'], $configs['pwd'], $configs['db_name']);

if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

mysqli_select_db($con,"user_brackets");

$sql_exists="SELECT * FROM user_brackets WHERE name='$name'";
$exists_result = mysqli_query($con,$sql_exists);
if(!$exists_result) {
	echo "ERROR: Could not check if the name exists already";
}
if(mysqli_num_rows($exists_result) > 0){
    echo "ERROR: Name already exists!";
    exit;
}

$sql="INSERT INTO user_brackets (name, compressed_bracket) VALUES ('$name', '$p')";

if(!mysqli_query($con,$sql)) {
	echo "ERROR: Could not insert ";
	exit;
}

mysqli_close($con);

//$array = mysqli_fetch_row($result);

//echo json_encode($array);

//mysqli_close($con);
echo "SUCCESS";
exit;
?>
