import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AddreviewPage } from '../addreview/addreview';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Data } from '../../provider/data';
import { DetailriwayatPage } from '../detailriwayat/detailriwayat';


/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  token: any;
  datas : any;
  batal : any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadCtrl : LoadingController,
    public toastCtrl : ToastController,
    public http : Http,
    private data : Data,
    public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryPage');
    this.getToken();
    this.getData();
  }

  getToken(){
    this.data.getToken().then((data)=>{
      this.token = data;
      console.log(this.token);
    })
  }

  getData(){
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });
    loading.present();


    this.data.getData().then((data) =>{
      console.log(data);

      let headers = new Headers({ 'Content-Type': 'application/json', 'Accept' : 'application/json', 'Authorization' : 'Bearer ' + this.token });
      let options = new RequestOptions({ headers: headers });

      this.http.get(this.data.link_hosting+"order/"+data.id, options).subscribe(data =>{
        let response = data.json(); 
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

      this.batal = [];
      for(var i = 0, j= 0; i < datas.length;i++){
        if(datas[i].status == 4 || datas[i].status == 9){
            this.batal[j] = datas[i];
            j++;
        }
      }
      return this.batal;
  }

  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  detail(data){
    this.navCtrl.push(DetailriwayatPage, data)
  }

}
