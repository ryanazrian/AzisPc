import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Data } from '../../provider/data';
import { ProfilePage } from '../profile/profile';


/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  nama : string;
  alamat : string;
  hp : string;
  email : string;
  id : string;

  submitted = false;  
  datas : any;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadCtrl : LoadingController,
              public http : Http,
              public toastCtrl : ToastController,
              public data : Data
  
            ) {
              this.datas = this.navParams.data;
              this.nama  = this.datas.nama;
              this.alamat = this.datas.alamat;
              this.hp = this.datas.hp;
              this.email = this.datas.email;
              this.id = this.datas.id;
              console.log(this.datas.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  editProfil(form:NgForm){
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });

    if(form.valid){
      loading.present();
      console.log(this.nama);
      let input = JSON.stringify({
        nama : this.nama,
        alamat : this.alamat,
        hp : this.hp,
        email : this.email,
        id : this.id
      });
      this.http.post(this.data.link_hosting+"EditProfil.php",input).subscribe(data => {
        loading.dismiss();
        let response = data.json();
        console.log(response);
        if(response.status == 200){
          let user=response.data;
          console.log(user);
          this.data.login(user);
          this.navCtrl.setRoot(ProfilePage);
        }
        this.showAlert(response.message);
          }, err => {
          loading.dismiss();
          this.showError(err);
          });
    }
  }

  showError(err: any){
    err.status==0?
    this.showAlert("Tidak ada koneksi. Cek kembali sambungan Internet perangkat Anda"):
    this.showAlert("Tidak dapat menyambungkan ke server. Mohon muat kembali halaman ini");
  }
  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
