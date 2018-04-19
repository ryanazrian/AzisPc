import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { HistoryPage } from '../pages/history/history';
import { ServicePage } from '../pages/service/service';

import { Data } from '../provider/data';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  
    rootPage: any = HomePage;
  
    pages: Array<{title: string, component: any, icon: string}>;
  
    constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public data: Data) {
      this.initializeApp();
  
      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'Beranda', component: ServicePage, icon: 'home' },
        { title: 'Barang Anda', component: HomePage, icon: 'laptop' },
        { title: 'Profil', component: ProfilePage, icon: 'person' },
        { title: 'Riwayat', component: HistoryPage, icon: 'time' },
      ];

      // this.rootPage(LoginPage);

      this.data.isLogin().then((value)=>{
        if(value){
             this.rootPage = ServicePage;
        } else {
           this.rootPage = LoginPage;
        }    
      });
  
    }
  
    initializeApp() {
      this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    }
  
    openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
    }
}
