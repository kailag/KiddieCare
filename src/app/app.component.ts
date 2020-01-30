import { Component } from '@angular/core';
import { Platform, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../pages/tabs/tabs';
import { RegisterPage } from '../pages/register/register';
import { PlaygroundPage } from '../pages/playground/playground';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, public loadingController: LoadingController) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();

      //this.presentLoadingCustom();

      this.storage.get('welcome').then(result => {
        if (result) {
          this.rootPage = PlaygroundPage;
        } else {
          this.rootPage = RegisterPage;
        }
      })
    });

  }

  // presentLoadingCustom() {
  //   let loading = this.loadingController.create({
  //     spinner: 'hide',
  //     content: `
  //       <div class="custom-spinner-container">
  //         <div class="custom-spinner-box"></div>
  //       </div>`,
  //     duration: 5000
  //   });  
  //   loading.present();
  // }

}
