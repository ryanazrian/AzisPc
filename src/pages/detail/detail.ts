import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AddreviewPage } from '../addreview/addreview';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Data } from '../../provider/data';



/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  disableButton = true;
  jemput = true;
  diagnosa = true;
  konfirmasi = true;
  tungguKonfirm = true;
  reparasi = true;
  selesai = true;
  split : string;
  count : number;
  countDays : any;
  datenow : any;
  mulaiReparasi : any;
  gambar:string =  "http://azizpc.codepanda.web.id/";

  data : any;
  token: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public loadCtrl : LoadingController,
              public toastCtrl : ToastController,
              public http : Http,
              private datas : Data,
              public alertCtrl: AlertController) {
                this.data = this.navParams.data;
                console.log(this.data);
                this.getToken();
                this.status(this.data.status);
                this.coutdown();
  }

  status(data){
    if(data ==1){
      this.jemput = true;
      this.diagnosa = false;
      this.konfirmasi = false;
      this.tungguKonfirm = false;
      this.reparasi = false;
      this.selesai = false;
    }

    else if(data == 2){
      this.jemput = false;
      this.diagnosa = true;
      this.konfirmasi = false;
      this.tungguKonfirm = false;
      this.reparasi = false;
      this.selesai = false;
    }

    else if(data == 3){
      this.jemput = false;
      this.diagnosa = false;
      this.konfirmasi = true;
      this.tungguKonfirm = false;
      this.reparasi = false;
      this.selesai = false;
    }

    else if(data == 5){
      this.jemput = false;
      this.diagnosa = false;
      this.konfirmasi = false;
      this.tungguKonfirm = true;
      this.reparasi = false;
      this.selesai = false;
    }

    else if(data == 6){
      this.jemput = false;
      this.diagnosa = false;
      this.konfirmasi = false;
      this.tungguKonfirm = false;
      this.reparasi = true;
      this.selesai = false;
    }
    else if(data == 7){
      this.jemput = false;
      this.diagnosa = false;
      this.konfirmasi = false;
      this.tungguKonfirm = false;
      this.reparasi = false;
      this.selesai = true;
    }
    else{
      this.jemput = false;
      this.diagnosa = false;
      this.konfirmasi = false;
      this.tungguKonfirm = false;
      this.reparasi = false;
      this.selesai = false;
    }
  }

  Terima() {
    let confirm = this.alertCtrl.create({
      title: 'Terima',
      message: 'Apakah anda yakin menerima reparasi dengan biaya sejumlah : duid? Barang yang telah dikonfirmasi tidak dapat dibatalkan.',
      buttons: [
        {
          text: 'Ya',
          handler: () => {
            console.log('Agree clicked');
            this.updateStatus(5);
            this.status(5);
          }
        },
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  Batal() {
    let confirm = this.alertCtrl.create({
      title: 'Batal',
      message: 'Apakah anda yakin ingin membatalkan reparasi?',
      buttons: [
        {
          text: 'Ya',
          handler: () => {
            console.log('Agree clicked');
            this.data.status = 99;
          }
        },
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  review(){
    this.navCtrl.push(AddreviewPage);
  }

  getToken(){
    this.datas.getToken().then((data)=>{
      this.token = data;
      console.log(this.token);
      });
  }

  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  } 

  showError(err: any){
    err.status==0?
    this.showAlert("Tidak ada koneksi. Cek kembali sambungan Internet perangkat Anda"):
    this.showAlert("Tidak dapat menyambungkan ke server. Mohon muat kembali halaman ini");
  }

  updateStatus(status){
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    loading.present();
    let input = JSON.stringify({
      status : status
    });
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept' : 'application/json', 'Authorization' : 'Bearer ' + this.token });
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.datas.link_hosting+"order/edit/"+ this.data.id, input, options).subscribe(data => {
      loading.dismiss();
      let response = data.json();
      // this.showAlert("Update Berhasil");
      console.log(response);
      if(response){
        let user=response.data;
        console.log(user);
        // this.data.login(user);
      }
      this.showAlert(response.message);
        }, err => {
        loading.dismiss();
        this.showError(err);
        });
  }

  coutdown(){
    // this.split = this.data.dateMulaiReparasi;
    // this.mulaiReparasi = this.split.split("-");
    
    var one_day=1000*60*60*24
    this.mulaiReparasi = new Date(new Date(this.data.dateMulaiReparasi).getTime()+(this.data.durasi*one_day));

    console.log(this.mulaiReparasi);

    this.datenow = new Date();
    // var now = this.datenow.split("/");
    // console.log(now[1]);

    //  this.count = Math.abs(Math.abs(this.mulaiReparasi[2] - now[1])-this.data.durasi);
     var diff = Math.abs(this.datenow - this.mulaiReparasi)/(one_day)+1;
     this.countDays = diff.toFixed();
     console.log(this.countDays);

    //  console.log(count);
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
