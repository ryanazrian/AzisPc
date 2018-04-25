import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Http, RequestOptions, Headers, RequestMethod } from '@angular/http';
import { Data } from '../../provider/data';
import { HomePage } from '../home/home';

/**
 * Generated class for the AddreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-addreview',
  templateUrl: 'addreview.html',
})
export class AddreviewPage {
  submitted = false;
  token: any;
  datas: any;
  reviews : any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadCtrl: LoadingController,
              public http: Http,
              public toastCtrl: ToastController,
              public data : Data  ) {
              this.datas = this.navParams.data;
              console.log(this.datas);
              this.getData();
              this.getToken();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddreviewPage');
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

  review(form:NgForm){
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });

    if(form.valid){
      loading.present();
      let headers = new Headers({ 'Content-Type': 'application/json', 'Accept' : 'application/json', 'Authorization' : 'Bearer ' + this.token });
      let options = new RequestOptions({ headers: headers });
      
      let input = JSON.stringify({
        orderId : this.datas.id,
        customerId : this.datas.user_id,
        content : this.reviews

      });
      console.log(input);
      this.http.post(this.data.link_hosting+"review/add",input, options).subscribe(data => {
        loading.dismiss();
        let response = data.json();
        console.log(response);
        if(response){
          let user=response.data;
          this.showAlert("Terima kasih sudah melakukan review");
          this.navCtrl.setRoot(HomePage);
        }
          }, err => {
          loading.dismiss();
          this.showError(err);
          });
    }
  }

  getData(){
    this.data.getData().then((data) =>{
      console.log(data)
    })
  }

  getToken(){
    this.data.getToken().then((data)=>{
      this.token = data;
      console.log(this.token);
    })
  }

}
