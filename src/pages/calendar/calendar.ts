import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, Platform, Events } from 'ionic-angular';
import { AddSchedulePage } from '../add-schedule/add-schedule';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Calendar } from '@ionic-native/calendar';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {
  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
  schedule: any;

  startDate = moment(new Date()).format('MMM D, YYYY');
  endDate = moment(new Date().setDate(new Date().getDate() + 31)).format('MMM D, YYYY');

  schedules = [];

  constructor(public localNotification: LocalNotifications, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private alertCtrl: AlertController, private storage: Storage, private toastCtrl: ToastController, private plt: Platform, private calendar: Calendar, public events: Events) {

    this.plt.ready().then(() => {
      this.listCalendarEvents();
    });

    events.subscribe('next-visit', () => {
      this.listCalendarEvents();
    });
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  listCalendarEvents() {
    let start = new Date();
    let end = new Date();
    end.setDate(start.getDate() + 31);

    this.calendar.listEventsInRange(start, end).then(events => {
      this.schedules = events;
      this.schedules = this.schedules.filter(event => event.title.includes('KiddieCare'));
    })
      .catch(err => this.presentToast(err));
  }

  openCal(schedule) {
    this.calendar.openCalendar(new Date(schedule.dtstart))
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  deleteSchedule(schedule) {
    let alert = this.alertCtrl.create({
      title: 'Delete Schedule',
      subTitle: 'Are you sure you want to delete the selected event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            this.calendar.deleteEvent(schedule.title, schedule.eventLocation, schedule.notes, new Date(schedule.dtstart), new Date(schedule.dtend))
              .then(res => {
                setTimeout(() => {
                  console.log(res);
                  this.presentToast('Event successfully deleted');
                  this.listCalendarEvents();
                });
              })
              .catch(err => this.presentToast(err));
          }
        }
      ]
    });
    alert.present();
  }

  addEvent() {
    let modal = this.modalCtrl.create(AddSchedulePage);
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        let scheduleData = data;
        this.calendar.createEventWithOptions(scheduleData.title, scheduleData.location, scheduleData.notes, new Date(scheduleData.startDate), scheduleData.endDate, scheduleData.options)
          .then(resolve => {
            setTimeout(() => {
              this.listCalendarEvents();
              this.presentToast('Schedule added successfully!');
            });
          })
          .catch(err => {
            console.log(err);
            this.presentToast(err)
          });
      }
    });
  }

}
