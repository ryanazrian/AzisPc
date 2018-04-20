import { Data } from './../../provider/data';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { DetailPage } from '../detail/detail';
import { AddrepairPage } from '../addrepair/addrepair';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  datas : any;
  submitted : boolean =false;
  dataku : any;
  id : string;
  gambar:string =  "http://azizpc.codepanda.web.id/";
  token : any;
  servisan:any = [];

  constructor(public navCtrl: NavController,
              public http : Http,
              public data : Data,
              public loadCtrl :LoadingController,
              public toastCtrl : ToastController
  ) {
    this.getToken();    
  }
  ionViewWillEnter(){
    this.getData();
  }

  detail(data) {
    this.navCtrl.push(DetailPage, data);
  }

  add(){
    this.navCtrl.push(AddrepairPage);
  }

  getToken(){
    this.data.getToken().then((data)=>{
      this.token = data;
      console.log(this.token);
    })
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

      this.http.get(this.data.link_hosting+"order/"+this.id, options).subscribe(data =>{
        let response = data.json(); 
        console.log(response);
        loading.dismiss();      
        if(response){
          let datas=response.data;
          this.datas = this.binding(datas);
          this.datas.reverse();
          console.log(this.datas);
          // this.binding();
          // this.navCtrl.setRoot(HomePage);
        } 
      }, err => {
        loading.dismiss();
        this.showAlert("Gagal Terhubung.Periksa Koneksi Anda");
        console.log('eerrror', err);
     })
    })  
  }

  binding(datas){

      this.servisan = [];
      for(var i = 0, j= 0; i < datas.length;i++){
        if(datas[i].status != 4){
            this.servisan[j] = datas[i];
            j++;
        }
      }
      return this.servisan;
  }

  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }


}
