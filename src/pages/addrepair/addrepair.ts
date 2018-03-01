import { HomePage } from './../home/home';
import { Data } from './../../provider/data';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
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
  image : string;


  lat : string;
  lang : string;
  token : any;
  lats : any;
  langs : any
  goo : any;



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
  
            this.goo = google.maps.event.addListener(map, 'click', function(event) {
              console.log(marker);
            var marker = new google.maps.Marker({
              // animation: google.maps.Animation.DROP,
              position: event.latLng,
              map: map,
              animation: google.maps.Animation.DROP,
              draggable:true,              
              title : 'Your Pick Up Location'
            });
             this.lokasi = marker.getPosition()
             this.lat = this.lokasi.lat();
             this.lang = this.lokasi.lng();
             console.log(marker);             
          })
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
        if(response){
          let datas=response.data;
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
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL, //to make it base64 image
        encodingType: this.camera.EncodingType.JPEG,
        mediaType:this.camera.MediaType.PICTURE,
        correctOrientation: true
      }

      const result =  await this.camera.getPicture(options);

      this.image = result;
      this.validFoto = true;
    }
    catch (e) {
      this.showAlert1(e);
    }

  }

  getPhotoFromGallery(){
    this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType     : this.camera.PictureSourceType.PHOTOLIBRARY,
        targetWidth: 600,
        targetHeight: 600
    }).then((imageData) => {
      // this.base64Image = imageData;
      // this.uploadFoto();
      this.image = imageData; 
      this.validFoto = true;
      }, (err) => {
        this.showAlert1(err);
    });
  }


  // uploadFile() {
  //   let loader = this.loadCtrl.create({
  //     content: "Uploading..."
  //   });
  //   loader.present();
  //   const fileTransfer: FileTransferObject = this.transfer.create();
  
  //   let options: FileUploadOptions = {
  //     fileKey: 'ionicfile',
  //     fileName: 'ionicfile',
  //     chunkedMode: false,
  //     mimeType: "image/jpeg",
  //     headers: {}
  //   }
  
  //   fileTransfer.upload(this.image, 'http://192.168.0.7:8080/api/uploadImage', options)
  //     .then((data) => {
  //     console.log(data+" Uploaded Successfully");
  //     this.imageFileName = "http://192.168.0.7:8080/static/images/ionicfile.jpg"
  //     loader.dismiss();
  //     this.showAlert1("Image uploaded successfully");
  //   }, (err) => {
  //     console.log(err);
  //     loader.dismiss();
  //     this.showAlert1(err);
  //   });
  // }
}
  