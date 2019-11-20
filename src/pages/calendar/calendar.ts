import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { AddSchedulePage } from '../add-schedule/add-schedule';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { DatabaseProvider } from '../../providers/database/database';
import { EditSchedulePage } from '../edit-schedule/edit-schedule';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  retrievedEvents: any;

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };


  markDisabled = (date: Date) => {
    var current = new Date();
    current.setDate(current.getDate() - 1);
    return date < current;
  };

  constructor(public localNotification: LocalNotifications, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private alertCtrl: AlertController, private childRecordsProvider: ChildRecordsProvider, private dbProvider: DatabaseProvider, private storage: Storage, private toastCtrl: ToastController) {
    console.log(new Date());

    this.storage.ready()
      .then(() => {
        this.loadEvents();
    })
  }

  async loadEvents() {
    await this.storage.get('schedules')
      .then(result => {
        console.log(result);
        if (result) {
          this.retrievedEvents = result;
          this.eventSource = JSON.parse(this.retrievedEvents);
          for (let i = 0; i < this.eventSource.length; i++) {
            this.eventSource[i].startTime = new Date(this.eventSource[i].startTime);
            this.eventSource[i].endTime = new Date(this.eventSource[i].endTime);
          }
        }
      });
    await console.log('Event Source', this.eventSource);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      showCloseButton: true,
      closeButtonText: 'Dismiss'
    });
    toast.present();
  }

  addEvent() {
    let modal = this.modalCtrl.create(AddSchedulePage, { selectedDay: this.selectedDay });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        let scheduleData = data;
        console.log(data);

        scheduleData.startTime = new Date(data.startTime);
        scheduleData.endTime = new Date(data.endTime);

        console.log('Schedule Data', scheduleData);
        let events = this.eventSource;
        events.push(scheduleData);
        this.eventSource = []
        setTimeout(() => {
          this.storage.set('schedules', JSON.stringify(events));
          this.eventSource = events;
        });
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let modal = this.modalCtrl.create(EditSchedulePage, {event});
    modal.present();
    // let start = moment(event.startTime).format('LLLL');

    // let alert = this.alertCtrl.create({
    //   title: '' + event.title,
    //   subTitle: `Date and Time: ${start}`,
    //   buttons: ['Dismiss']
    // })
    // alert.present();
  }

  onTimeSelected(ev) {
    console.log(ev);
    this.selectedDay = ev.selectedTime;
  }

}
