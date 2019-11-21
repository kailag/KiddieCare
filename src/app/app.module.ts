import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SQLite } from '@ionic-native/sqlite';
import { NgCalendarModule } from 'ionic2-calendar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { NgPipesModule } from 'ngx-pipes';

import { AboutPage } from '../pages/about/about';
import { ProfilePage } from '../pages/profile/profile';
import { ChildrenPage } from '../pages/children/children';
import { TabsPage } from '../pages/tabs/tabs';
import { AddChildPage } from '../pages/add-child/add-child';
import { ViewChildPage } from '../pages/view-child/view-child';
import { CalendarPage } from '../pages/calendar/calendar';
import { AddSchedulePage } from '../pages/add-schedule/add-schedule';
import { RegisterPage } from '../pages/register/register';
import { EditChildPage } from '../pages/edit-child/edit-child';
import { ChildRecordsProvider } from '../providers/child-records/child-records';
import { AddChildRecordPage } from '../pages/add-child-record/add-child-record';
import { AddProfilePage } from '../pages/add-profile/add-profile';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { EditSchedulePage } from '../pages/edit-schedule/edit-schedule';
import { EditChildRecordPage } from '../pages/edit-child-record/edit-child-record';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DatabaseProvider } from '../providers/database/database';
import { ConsultationProvider } from '../providers/consultation/consultation';
import { ProfileProvider } from '../providers/profile/profile';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import { Camera } from '@ionic-native/camera';
import { ScheduleProvider } from '../providers/schedule/schedule';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ProfilePage,
    ChildrenPage,
    TabsPage,
    CalendarPage,
    AddSchedulePage,
    AddChildPage,
    ViewChildPage,
    RegisterPage,
    EditChildPage,
    AddChildRecordPage,
    AddProfilePage,
    EditProfilePage,
    EditSchedulePage,
    EditChildRecordPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    NgCalendarModule,
    HttpClientModule,
    NgPipesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ProfilePage,
    ChildrenPage,
    TabsPage,
    CalendarPage,
    AddSchedulePage,
    AddChildPage,
    ViewChildPage,
    RegisterPage,
    EditChildPage,
    AddChildRecordPage,
    AddProfilePage,
    EditProfilePage,
    EditSchedulePage,
    EditChildRecordPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    LocalNotifications,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SQLite,
    SQLitePorter,
    ChildRecordsProvider,
    DatabaseProvider,
    ConsultationProvider,
    ProfileProvider,
    ScheduleProvider
    /*File,
    FileOpener*/
  ]
})
export class AppModule { }
