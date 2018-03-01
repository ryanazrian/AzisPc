import { Data } from '../../provider/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Http, RequestOptions, Headers, RequestMethod } from '@angular/http';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  user: {nama?: string, email?: string, password?: string, role?:string, hp?:string, alamat?: string} = {};  
  submitted = false;
  status = "password";
  lihat = true;
  status2 = "password";
  lihat2 = true;

  // nomor:number;
  // name:string;
  // email: string;
  // password: string;
  // password2:string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadCtrl: LoadingController,
              public http: Http,
              public toastCtrl: ToastController,
              public data : Data              
            ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  showPassword(){
    this.status = "text";
    this.lihat = false;
    console.log(this.status);
  }

  hidePassword(){
    this.status = "password";
    this.lihat = true;
    console.log(this.status);
  }

  showPassword2(){
    this.status2 = "text";
    this.lihat2 = false;
    console.log(this.status);
  }

  hidePassword2(){
    this.status2 = "password";
    this.lihat2 = true;
    console.log(this.status);
  }

  signIn() {
    this.navCtrl.push(LoginPage);
  }

  signUp(form: NgForm){
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });

    if(form.valid){
      loading.present();
      let headers = new Headers({ 'Content-Type': 'application/json', 'Accept' : 'application/json' });
      let options = new RequestOptions({ headers: headers });
      
      let input = JSON.stringify({
        name : this.user.nama,
        email : this.user.email,
        password : this.user.password,
        status : this.user.role = "2",
        phone : this.user.hp,
        alamat : this.user.alamat
      });
      this.http.post(this.data.link_hosting+"auth/register",input, options).subscribe(data => {
        loading.dismiss();
        let response = data.json();
        console.log(response);
        if(response){
          let user=response.data;
          console.log(user);
          this.data.login(user);
          this.data.token(response.meta.token);
          this.navCtrl.setRoot(HomePage);
          
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
