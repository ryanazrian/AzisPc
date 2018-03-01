<?php
    include 'config.php';
      $postdata = file_get_contents("php://input");
    //   $username="";
    //   $password="";
      $id="";
      $nama="";
      $hp="";
      $email="";
      $alamat="";
      if (isset($postdata)) {
          $request = json_decode($postdata);
        //   $username = $request->username;
        //   $password = $request->password;
          $id = $request->id;
          $nama= $request->nama;
          $hp=$request->hp;
          $email=$request->email;
          $alamat=$request->alamat;
      }
      $encrypt_password = md5($password);
      $sql = mysqli_query($conn,"UPDATE user SET nama='$nama', hp='$hp', alamat='$alamat' WHERE id='$id'");
  if($sql){
      $getUserSql=mysqli_query($conn, "SELECT * from user WHERE id='$id'");
      if (mysqli_num_rows($getUserSql)) {
        $row = mysqli_fetch_assoc($getUserSql);
        $data =array(
            'message' => "Data have been Change",
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
