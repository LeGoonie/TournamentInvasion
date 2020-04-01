<?php
    $conn = new mysqli("localhost", "root", "project", "123Coisaetal");
    if($conn->connect_error){
        die("Connection Failed!".$conn->connect_error);
    }
    
    $result = array('error'=>false);
    $action = '';
    if(isset($_GET['action'])){
        $action = $_GET['action'];
    }

    if($action == 'read'){
        $sql = $conn->query("")
    }
?>