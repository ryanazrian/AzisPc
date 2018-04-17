import { HomePage } from './../home/home';
import { Data } from './../../provider/data';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { NgForm } from '@angular/forms';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation'; 
import { ElementDef } from '@angular/core/src/view';
import { Storage } from '@ionic/storage';



declare var google : any;
/**
 * Generated class for the AddrepairPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-addrepair',
  templateUrl: 'addrepair.html',
})
export class AddrepairPage {
  public photos: any;
  public base64Image: string;

  imageFileName: any;

  lokasi : any;
  idBarang : any;

  tipeKerusakan : any ="a";

  
  namaBarang : string;
  charger : boolean = false;
  mouse : boolean = false;
  mushrooms : boolean = false;
  cd : boolean = false;
  gaming : string;
  keluhan : string;
  alamat : string;
  id : string;
  datas : any;
  service : any = "a";
  services : string;

  validFoto = false;
  image : any;
  percentageLoaded: any


  lat : string;
  lang : string;
  token : any;
  lats : any;
  langs : any
  goo : any;
  tanda = 0;



  options : GeolocationOptions;
  currentPos : Geoposition;
  @ViewChild('map') mapElement : ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;
  places : Array<any> ;
  langt : string;
  longt : string;

  submitted = false;

  constructor(public alertCtrl: AlertController, 
              private camera: Camera, 
              //private transfer: FileTransfer,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public loadCtrl : LoadingController,
              public http: Http,     
              public data: Data,
              private transfer: FileTransfer,
              public toastCtrl: ToastController,
              private geolocation: Geolocation,
              public storage : Storage,
              public actionSheetCtrl : ActionSheetController
              
            ) {
              this.data.getData().then((data) =>{
                this.datas = data;
                this.id = this.datas.id;
                console.log(this.datas);
              }) 

              this.getUserPosition();
              this.getToken();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddrepairPage');
  }

  ngOnInit(){
    this.photos = [];
  }

  // takePhoto(){
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }
    
  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64:
  //     this.base64Image = 'data:image/jpeg;base64,' + imageData;
  //     this.photos.push(this.base64Image);
  //     this.photos.revese();  
  //   }, (err) => {
  //    // Handle error
  //   });
  // }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Gagal',
      subTitle: 'Gagal mengambil gambar',
      buttons: ['OK']
    });
    alert.present();
  }

  getToken(){
    this.data.getToken().then((data)=>{
    this.token = data;
    console.log(this.token);
    });
  }

  latitude(data : string){
    this.storage.set('lat', data);    
  }

  longitude(data : string){
    this.storage.set('long', data);    
  }

  getLat(){
    this.data.getToken().then((data)=>{
      this.lats = data;
    })
  }

  getLang(){
    this.data.getToken().then((data)=>{
      this.langs = data;
    })
  }

  getUserPosition(){
    this.options = {
      enableHighAccuracy : true
    };
    this.geolocation.getCurrentPosition(this.options)
    .then((pos : Geoposition) => {
      this.currentPos = pos;
      console.log(pos);
      this.latitude
     //  this.addMap(pos.coords.latitude, pos.coords.longitude)
     this.loadMap(pos.coords.latitude, pos.coords.longitude);
    //  this.startNavigating(pos.coords.latitude, pos.coords.longitude, this.langt, this.longt);
    },(err : PositionError)=>{
    console.log("error : " + err.message)
  });
  }


  loadMap(lat, long){
           let latLng = new google.maps.LatLng(lat, long);
           let mapOptions = {
             center: latLng,
             zoom: 15,
             mapTypeId: google.maps.MapTypeId.ROADMAP
           }
           let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
           var messagewindow = new google.maps.InfoWindow({
            content: document.getElementById('Your Pick Up Location')
          });
  
            // this.goo = google.maps.event.addListener(map, 'click', function(event) {

              var marker = new google.maps.Marker({
                // animation: google.maps.Animation.DROP,
                position: latLng,
                map: map,
                animation: google.maps.Animation.DROP,
                draggable:true,              
                title : 'Your Pick Up Location'
              });
              console.log("sini");
              this.tanda=1;

             this.lokasi = marker.getPosition()
             this.lat = this.lokasi.lat();
             this.lang = this.lokasi.lng();
             console.log(marker);             
          // })
       }


  repair(form : NgForm){
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });
    this.getLang();
    this.getLat();

    console.log(this.token);
    console.log(this.goo.f.lang);

    if(form.valid){
      loading.present();

      let kelengkapan = 'charger = '+this.charger + ',' +  
                         'mouse = '+ this.mouse + ',' + 
                         'mushrooms = '+ this.mushrooms + ',' +
                         'cd = '+this.cd;
      console.log(this.tipeKerusakan)
      if(this.service != "a"){
        this.tipeKerusakan = JSON.stringify(this.service);
        this.tipeKerusakan = this.tipeKerusakan.replace('[', '');
        this.tipeKerusakan = this.tipeKerusakan.replace(']', ''); 
        for(var i= 0 ; i< this.service.length*2;i++)
        this.tipeKerusakan = this.tipeKerusakan.replace('"', '');
      }

      console.log(this.tipeKerusakan);

      let input = JSON.stringify({
        user_id : this.id, 
        namaBarang : this.namaBarang,
        keluhan : this.keluhan,
        kelengkapan : kelengkapan,
        tipeKerusakan : this.tipeKerusakan,
        alamat : this.alamat,
        status : "1", 
        langitude : this.goo.f.lat,
        longitude : this.goo.f.lang
      }); 
      console.log("input", input)
      console.log(this.service);


      let headers = new Headers({ 'Content-Type': 'application/json', 'Accept' : 'application/json', 'Authorization' : 'Bearer ' + this.token });
      let options = new RequestOptions({ headers: headers });

      this.http.post(this.data.link_hosting+"order/add", input, options).subscribe(data =>{
        loading.dismiss();
        let response = data.json();
        this.idBarang = response.data.id;
        console.log(response);
        console.log(this.idBarang);
        if(response){
          let datas=response.data;
          this.postPhoto(this.image, this.idBarang, this.token);
          console.log(datas);

          this.navCtrl.setRoot(HomePage);
          
        }
        this.showAlert1(response.message);
          }, err => {
          loading.dismiss();
          this.showError(err);
          });

    }
  }
  
  showError(err: any){
    err.status==0?
    this.showAlert1("Tidak ada koneksi. Cek kembali sambungan Internet perangkat Anda"):
    this.showAlert1("Tidak dapat menyambungkan ke server. Mohon muat kembali halaman ini");
  }

  showAlert1(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
  
  tambahGambar() {
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
        targetHeight: 400,
        targetWidth: 400,
        destinationType: this.camera.DestinationType.FILE_URI, //FILE URI itu buat image aseli
        encodingType: this.camera.EncodingType.JPEG,
        mediaType:this.camera.MediaType.PICTURE,
        correctOrientation: true
      }

      const result =  await this.camera.getPicture(options);
      this.image = result;

      // this.img = 'data:image/jpeg;base64,' + result;
//      this.postPhoto(result);

      //this.validPhoto=true;

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
        targetWidth: 400,
        targetHeight: 400
    }).then((imageData) => {
      // this.base64Image = imageData;
      // this.uploadFoto();
      this.image = imageData;
      
      // this.img = 'data:image/jpeg;base64,' + imageData;
  //    this.postPhoto(imageData);
      
      //this.validPhoto=true;
      }, (err) => {
    });
  }


  postPhoto(data, id, token){
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
      fileName: "this.email + Date.now()",
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {'Authorization': 'Bearer ' + token}
    }

    fileTransfer.upload(data, this.data.link_hosting+"order/edit/"+id, options)
      .then((data) => {

      // this.saveToStorage(data.response);          
      // this.navCtrl.setRoot(LoginPage);      
      // this.ionViewWillEnter();
    }, (err) => {
      console.log(err);
      this.showAlert1(JSON.stringify(err));
    });
     
  }
}
  