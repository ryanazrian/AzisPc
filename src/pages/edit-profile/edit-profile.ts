import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ActionSheetController, AlertController } from 'ionic-angular';
import { Data } from '../../provider/data';
import { ProfilePage } from '../profile/profile';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';



/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  nama : string;
  alamat : string;
  hp : string;
  email : string;
  id : string;

  image : any;
  percentageLoaded: any

  submitted = false;  
  datas : any;
  validPhoto = false; 
  token : string;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadCtrl : LoadingController,
              public http : Http,
              public toastCtrl : ToastController,
              public data : Data,
              private camera: Camera,
              private transfer: FileTransfer,
              public actionSheetCtrl : ActionSheetController,
              public alertCtrl : AlertController
            ) {
              this.datas = this.navParams.data;
              this.nama  = this.datas.nama;
              this.alamat = this.datas.alamat;
              this.hp = this.datas.hp;
              this.email = this.datas.email;
              this.id = this.datas.id;
              this.image ="http://azizpc.codepanda.web.id/"+ this.datas.foto;
              console.log(this.datas.id);
              this.getToken();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProfilePage');
  }

  editProfil(form:NgForm){
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });

    if(form.valid){
      loading.present();
      console.log(this.nama);
      let input = JSON.stringify({
        nama : this.nama,
        alamat : this.alamat,
        hp : this.hp,
        email : this.email,
        id : this.id
      });
      this.http.post(this.data.link_hosting+"EditProfil.php",input).subscribe(data => {
        loading.dismiss();
        let response = data.json();
        console.log(response);
        if(response.status == 200){
          let user=response.data;
          console.log(user);
          this.data.login(user);
          this.navCtrl.setRoot(ProfilePage);
        }
        this.showAlert(response.message);
          }, err => {
          loading.dismiss();
          this.showError(err);
          });
    }
  }

  getToken(){
    this.data.getToken().then((data)=>{
      this.token = data;
      console.log(this.token);
      });
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
    
       updatePicture() {
        let actionSheet = this.actionSheetCtrl.create({
          title: 'Pilihan',
          buttons: [
            {
              text: 'Ambil Gambar Baru',
              role: 'ambilGambar',
              handler: () => {
                this.takePicture();
              }
            },
            {
              text: 'Pilih Dari Galleri',
              role: 'gallery',
              handler: () => {
                this.getPhotoFromGallery();
              }
            }
          ]
        });
        actionSheet.present();
      }
    
      async takePicture(){
        try {
          const options : CameraOptions = {
            quality: 50, //to reduce img size
            targetHeight: 600,
            targetWidth: 600,
            destinationType: this.camera.DestinationType.FILE_URI, //FILE URI itu buat image aseli
            encodingType: this.camera.EncodingType.JPEG,
            mediaType:this.camera.MediaType.PICTURE,
            correctOrientation: true
          }
    
          const result =  await this.camera.getPicture(options);
          this.image = result;
    
          // this.img = 'data:image/jpeg;base64,' + result;
          this.postPhoto(result);
    
          this.validPhoto=true;
    
        }
        catch (e) {
          console.error(e);
          alert("error");
        }
    
      }
    
      getPhotoFromGallery(){
        this.camera.getPicture({
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType     : this.camera.PictureSourceType.PHOTOLIBRARY,
            targetWidth: 600,
            targetHeight: 600
        }).then((imageData) => {
          // this.base64Image = imageData;
          // this.uploadFoto();
          this.image = imageData;
          
          // this.img = 'data:image/jpeg;base64,' + imageData;
          this.postPhoto(imageData);
          
          this.validPhoto=true;
          }, (err) => {
        });
      }
    
    
      postPhoto(data){
        // alert(data);
        // alert("token" + this.token);
        const fileTransfer: FileTransferObject = this.transfer.create();

        let alert = this.alertCtrl.create({
          subTitle: 'Uploading... 0%',
          buttons: ['Hold on for a few seconds...']
        });
        alert.present();
    
        fileTransfer.onProgress((progress) => {
          if(progress.lengthComputable) {
            this.percentageLoaded = (progress.loaded / progress.total) * 100;
            console.log('Percentage -> ' + this.percentageLoaded)
            const elem = document.querySelector("h3.alert-sub-title");
            const alertBt = document.querySelector("button.alert-button");
    
            if(this.percentageLoaded < 100) {
              if(elem) elem.innerHTML = '<span style="font-size: 16px; font-weight: bold;">Uploading... ' + this.percentageLoaded.toFixed(0) + '%</span><br>' +
              '<div style="width: 100%;margin: 10px 0 0 0;padding: 0px;text-align: center;background-color: #f4f4f4;border: none;color: #fff;border-radius: 20px;">' +
              '<div style="white-space: nowrap;overflow: hidden;padding: 5px;border-radius: 20px; background-color: #1BB18C; width:' + this.percentageLoaded.toFixed(0) + '%;"></div>' +
              '</div>';
            } else if(this.percentageLoaded == 100) {
              if(elem) elem.innerHTML = '<span style="font-size: 16px; font-weight: bold;">Done!</span>' +
              '<div style="width: 100%;margin: 10px 0 0 0;padding: 0px;text-align: center;background-color: #f4f4f4;border: none;color: #fff;border-radius: 20px;">' +
              '<div style="white-space: nowrap;overflow: hidden;padding: 5px;border-radius: 20px; background-color: #1BB18C; width:100%;"></div>' +
              '</div>';
              if(alertBt) alertBt.innerHTML = '<span class="button-inner">Okay</span>';
            }
    
          }
        })
    
        
        let options: FileUploadOptions = {
          fileKey: 'foto',
          fileName: this.email + Date.now(),
          chunkedMode: false,
          mimeType: "image/jpeg",
          headers: {'Authorization': 'Bearer ' + this.token}
        }
    
        fileTransfer.upload(data, this.data.link_hosting+"users/"+this.id, options)
          .then((data) => {
  
          // this.saveToStorage(data.response);          
          // this.navCtrl.setRoot(LoginPage);
              
          let alert = this.alertCtrl.create({
            title: 'Update Foto Berhasil',
            message: 'Harap login kembali.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  console.log('Agree clicked');
                }
              }
            ]
          });
            alert.present();    
          
          // this.ionViewWillEnter();
        }, (err) => {
          console.log(err);
          this.showAlert( JSON.stringify(err));
        });
         
      }

}
