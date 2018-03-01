<?php
    include 'config.php';
      $postdata = file_get_contents("php://input");
    //   $username="";
      $password="";
      $role="";
      $nama="";
      $hp="";
      $email="";
      $alamat="";
      if (isset($postdata)) {
          $request = json_decode($postdata);
        //   $username = $request->username;
          $password = $request->password;
          $role = $request->role;
          $nama= $request->nama;
          $hp=$request->hp;
          $email=$request->email;
          $alamat=$request->alamat;
      }
      $encrypt_password = md5($password);
      $sql = mysqli_query($conn,"INSERT INTO user ( nama, email, hp, passwords, status, alamat)
      VALUES ('$nama','$email', '$hp','$encrypt_password','$role', '$alamat')");
  if($sql){
      $getUserSql=mysqli_query($conn, "SELECT * from user WHERE email='$email' AND passwords = '$encrypt_password'");
      if (mysqli_num_rows($getUserSql)) {
        $row = mysqli_fetch_assoc($getUserSql);
        $data =array(
            'message' => "Data have been recorded",
            'data' => $row,
            'status' => "200"
        );
      }
      else{
        $row = mysqli_fetch_assoc($getUserSql);        
        $data =array(
            'message' => "ERROR",
            'data' => $encrypt_password,
            'status' => "404"
        );
      }
  }
 else {
    $data =array(
        'message' => "ERROR 1",
        'status' => "404"
    );
  }
  echo json_encode($data);
?>
