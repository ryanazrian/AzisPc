import { Http, RequestOptions, Headers } from '@angular/http';
import { EditProfilePage } from './../edit-profile/edit-profile';
import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { IonicPage, NavController, App, NavParams, AlertController } from 'ionic-angular';
import { Data } from '../../provider/data';
import { Camera, CameraOptions } from '@ionic-native/camera';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  datas : any;
  nama : string;
  email : string;
  hp : string;
  alamat : string;

  token : any;

  public photos: any;
  public base64Image: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public data : Data,
              public alertCtrl : AlertController,
              public app : App,
              private camera: Camera,
              public http : Http  
            ) {
              this.data.getData().then((data) =>{
                this.datas = data;
                this.nama = this.datas.nama;
                this.email = this.datas.email;
                this.hp = this.datas.hp;
                this.alamat = this.datas.alamat;
          
                console.log(this.datas.alamat)
              })
              this.getToken();             
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getToken(){
    this.data.getToken().then((data)=>{
    this.token = data;
    this.getData();
    });
    
  }

  getData(){
    let headers = new Headers({ 'Content-Type': 'application/json', 'Accept' : 'application/json', 'Authorization' : 'Bearer ' + this.token });
    let options = new RequestOptions({ headers: headers });

    this.http.get(this.data.link_hosting+"users/profile", options).subscribe(data =>{
      let response = data.json();
      console.log(response);
    })
  }


  logOut(){
    let confirm = this.alertCtrl.create({ 
      title: '', 
      subTitle: 'Apakah kamu yakin ingin keluar?', 
      buttons: [ 
        { 
          text: 'Tidak', 
          handler: () => { 
            console.log('Disagree clicked'); 
          } 
        }, 
        { 
          text: 'Ya', 
          handler: () => { 
            console.log('Agree clicked') 
            // this.navCtrl.setRoot(MyApp); 
            this.data.logout(); 
            this.app.getRootNav().setRoot(LoginPage); 
            // , 
            // this.data.logout(); 
            // this.app.getRootNav().setRoot(MyApp); 
          } 
        } 
      ] 
    }); 
    confirm.present(); 
  }

  editProfil(){
    this.navCtrl.push(EditProfilePage, this.datas)
  }

  takePhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photos.push(this.base64Image);
      this.photos.revese();  
    }, (err) => {
     // Handle error
    });
  }


}
