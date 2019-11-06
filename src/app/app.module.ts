import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SQLite } from '@ionic-native/sqlite';
import { NgCalendarModule } from 'ionic2-calendar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PlaygroundPage } from '../pages/playground/playground';
import { AddChildPage } from '../pages/add-child/add-child';
import { ViewChildPage } from '../pages/view-child/view-child';
import { SchedulePage } from '../pages/schedule/schedule';
import { AddSchedulePage } from '../pages/add-schedule/add-schedule';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ChildRecordsProvider } from '../providers/child-records/child-records';
import { DatabaseProvider } from '../providers/database/database';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PlaygroundPage,
    SchedulePage,
    AddSchedulePage,
    AddChildPage,
    ViewChildPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    NgCalendarModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PlaygroundPage,
    SchedulePage,
    AddSchedulePage,
    AddChildPage,
    ViewChildPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SQLite,
    SQLitePorter,
    ChildRecordsProvider,
    DatabaseProvider
  ]
})
export class AppModule { }
