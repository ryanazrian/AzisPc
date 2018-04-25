import { Data } from './../../provider/data';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


/**
 * Generated class for the ServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-service',
  templateUrl: 'service.html',
})
export class ServicePage {
  submitted =false;
  token : any;
  dataku : any;
  id : string;
  datas : any;
  gambar:string =  "http://azizpc.codepanda.web.id/";


  constructor(
    public navCtrl: NavController,
    public http : Http,
    public data : Data,
    public loadCtrl :LoadingController,
    public toastCtrl : ToastController

) {
  this.getToken();
  this.getData();
  

  }

  getToken(){
    this.data.getToken().then((data)=>{
    this.token = data;
    console.log(this.token);
    })
  }

  showAlert(message){
    let toast = this.toastCtrl.create({
    message: message,
    duration: 3000
    });
    toast.present();
  }

  tanggal(){
    for(var i =0; i< this.datas.length; i++){
      this.datas[i].created_at.date = new Date(this.datas[i].created_at.date).toDateString();
    } 
  }

  getData(){
    this.submitted = true;
    let loading = this.loadCtrl.create({
    content: 'Tunggu sebentar...'
    });
    loading.present();


      this.data.getData().then((data) =>{
      this.dataku = data;
      console.log(this.dataku);
      this.id = this.dataku.id;
      console.log(this.id);
      console.log(this.token);

      let headers = new Headers({ 'Content-Type': 'application/json', 'Accept' : 'application/json', 'Authorization' : 'Bearer ' + this.token });
      let options = new RequestOptions({ headers: headers });

        this.http.get(this.data.link_hosting+"review/get", options).subscribe(data =>{
        let response = data.json(); 
        console.log(response);
        loading.dismiss();      
          if(response){
            let datas=response.data;
            this.datas = datas;
            this.datas.reverse();
            console.log(this.datas[0].created_at.date);
            this.tanggal();
          } 
        }, err => {
        loading.dismiss();
        this.showAlert("Gagal Terhubung.Periksa Koneksi Anda");
        console.log('eerrror', err);
        })
      })  
    }
}
