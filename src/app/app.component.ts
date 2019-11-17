import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

import { TabsPage } from '../pages/tabs/tabs';
import { RegisterPage } from '../pages/register/register';
import { DatabaseProvider } from '../providers/database/database';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { ProfileProvider } from '../providers/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage: any;
  rootPage: any = TabsPage;
  private database: SQLiteObject;

    

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public dbProvider: DatabaseProvider, public sqlite: SQLite, private storage: Storage, private http: HttpClient, public sqlitePorter: SQLitePorter, private toastCtrl: ToastController, private profileProvider: ProfileProvider) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // this.checkLogin();

  }

  // checkLogin(){
  //   if(this.profileProvider.readAllParent()){
  //     this.rootPage = RegisterPage;
  //   }
  //   else{
  //     this.rootPage = TabsPage;
  //   }
  // }
  //count if data exist if none then register

}
