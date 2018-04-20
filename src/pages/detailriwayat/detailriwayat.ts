import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetailriwayatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-detailriwayat',
  templateUrl: 'detailriwayat.html',
})
export class DetailriwayatPage {
  data : any;

  tanggalReparasi : any;
  tanggalDiagnosa : any;
  tanggalIn : any;
  tanggalPenjemputan : any;
  tanggalPenjemputan1 : any;
  tanggalSelesai : any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.data;
    console.log(this.data);
    this.tanggal();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailriwayatPage');
  }

  tanggal(){
    this.tanggalSelesai = new Date(this.data.dateSelesai).toDateString();
    this.tanggalIn = new Date(this.data.dateIn).toDateString();
  }

}
