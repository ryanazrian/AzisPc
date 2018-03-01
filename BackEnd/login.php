<?php

  include 'config.php';

    $postdata = file_get_contents("php://input");
    $email="";
    $password="";
    if (isset($postdata)) {
        $request = json_decode($postdata);
        $email = $request->email;
        $password = $request->password;
    }
    $encrypt_password = md5($password);

    $query_login = mysqli_query($conn,"SELECT * FROM user WHERE email='$email' AND passwords='$encrypt_password'");
    if(mysqli_num_rows($query_login)){

        $row=mysqli_fetch_assoc($query_login);
        $data =array(
            'message' => "Login Success",
            'data' => $row,
            'status' => "200"
        );
    }
    else{   
        $data =array(
            'message' => "Login Failed, Username or Password Wrong",
            'status' => "404"

        );
    }
    echo json_encode($data);
?>
