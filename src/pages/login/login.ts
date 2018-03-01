import { Data } from '../../provider/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { NgForm } from '@angular/forms';
import { Http, RequestOptions, Headers } from '@angular/http';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  // user: {nama?: string, email?: string, password?: string, role?:string, hp?:string} = {};  
  
  submitted = false;
  status = "password";
  lihat = true;

  token: string;
  
  email: string;
  password: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadCtrl : LoadingController,
              public http : Http,
              public data : Data,
              public toastCtrl : ToastController,
              public alertCtrl: AlertController,
            ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  sign(form : NgForm){
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });
    console.log(this.email);
    if(form.valid){
      loading.present();
      let headers = new Headers({ 'Content-Type': 'application/json', 'Accept' : 'application/json' });
      let options = new RequestOptions({ headers: headers });

      let input = JSON.stringify({
        email : this.email,
        password : this.password
      });

      this.http.post(this.data.link_hosting+"auth/login",input, options).subscribe(data =>{
        let response = data.json();
        if(response){
          loading.dismiss();          
          console.log("masuk");
          let user = response.data;
          // console.log(user);
          // console.log(response.meta.token);
          this.token = response.meta.token;
          this.data.token(this.token);
          this.data.login(user);
          this.navCtrl.setRoot(HomePage);
          this.showAlert(response.message);                  
        }
      }, err => {
        loading.dismiss();
        this.showAlert("Login Gagal. Silahkan Periksa Kembali email dan password anda");
        console.log('eerrror', err);
     });
    }
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

  Register() {
    this.navCtrl.push(RegisterPage);
  }

  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  signUp(){
    this.navCtrl.setRoot(RegisterPage);
  }

  skip(){
    this.navCtrl.setRoot(HomePage);
  }



}
