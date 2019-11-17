import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import * as moment from 'moment';
import { AddSchedulePage } from '../add-schedule/add-schedule';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setDate(current.getDate() - 1);
    return date < current;
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private alertCtrl: AlertController, private localNotif: LocalNotifications, private platform: Platform) {
    console.log(new Date());

    this.platform.ready().then(() => {
      this.localNotif.on("click");
    });
  }

  addEvent() {
    let modal = this.modalCtrl.create(AddSchedulePage, { selectedDay: this.selectedDay });
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;
        console.log(data);

        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);

        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');

    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }

  /*onTimeSelected = (ev: { selectedTime: Date, events: any[] }) => {
    console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0));
  };*/
  onTimeSelected(ev) {
    console.log(ev);
    this.selectedDay = ev.selectedTime;
  }

  push(){
    this.platform.ready().then(() => {
      this.localNotif.schedule({
        id: 1,
        title: 'My First Notification',
        text: 'Message here!',
        trigger: {at: new Date(new Date().getTime())},
        data: {"id": 1, "name": "Maria Mercades"}
     });
    });
  }

}
