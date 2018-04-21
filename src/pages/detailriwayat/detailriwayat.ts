import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AddreviewPage } from '../addreview/addreview';


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
  gambar:string =  "http://azizpc.codepanda.web.id/";

  tanggalReparasi : any;
  tanggalDiagnosa : any;
  tanggalIn : any;
  tanggalPenjemputan : any;
  tanggalPenjemputan1 : any;
  tanggalSelesai : any;

  garansi: any;
  dateNow: any;
  countDays: any;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.data;
    console.log(this.data);
    this.tanggal();
    this.coutdown();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailriwayatPage');
  }

  tanggal(){
    this.tanggalSelesai = new Date(this.data.dateSelesai).toDateString();
    this.tanggalIn = new Date(this.data.dateIn).toDateString();
  }

  review(){
    this.navCtrl.push(AddreviewPage);
  }

  coutdown(){

    var one_day=1000*60*60*24
    this.garansi = new Date(new Date(this.data.dateOut).getTime()+(7*one_day));

    console.log(this.garansi);

    this.dateNow = new Date();

     var diff = Math.abs(this.dateNow - this.garansi)/(one_day);
     this.countDays = diff.toFixed();
     if(this.countDays >=0){
       this.countDays;
     }
     else{
       this.countDays = 0;
     }
     console.log(this.countDays);


     
  }

}
