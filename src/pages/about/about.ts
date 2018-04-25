import { Data } from './../../provider/data';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  submitted =false;
  token : any;
  dataku : any;
  id : string;
  datas : any;

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

      this.http.get(this.data.link_hosting+"review/get"+this.id, options).subscribe(data =>{
        let response = data.json(); 
        console.log(response);
        loading.dismiss();      
        if(response){
          let datas=response.data;
          // this.datas = this.binding(datas);
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

}
