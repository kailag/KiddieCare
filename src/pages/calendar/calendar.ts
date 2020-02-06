import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController, Platform } from 'ionic-angular';
import { AddSchedulePage } from '../add-schedule/add-schedule';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { EditSchedulePage } from '../edit-schedule/edit-schedule';

import { Calendar } from '@ionic-native/calendar';

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

  schedules = [];
  schedulesJson: any;

  // calendar = {
  //   mode: 'month',
  //   currentDate: new Date()
  // };

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setDate(current.getDate() - 1);
    return date < current;
  };

  constructor(public localNotification: LocalNotifications, public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private alertCtrl: AlertController, private storage: Storage, private toastCtrl: ToastController, private plt: Platform, private calendar: Calendar) {

    // this.storage.ready()
    //   .then(() => {
    //     this.loadEvents();
    //   })

    this.plt.ready().then(() => {
      this.listCalendarEvents();
    })
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  async loadEvents() {
    await this.storage.get('schedules')
      .then(result => {
        console.log(result);
        if (result) {
          this.schedule = result;
          this.eventSource = JSON.parse(this.schedule);
          for (let i = 0; i < this.eventSource.length; i++) {
            this.eventSource[i].startTime = new Date(this.eventSource[i].startTime);
            this.eventSource[i].endTime = new Date(this.eventSource[i].endTime);
          }
        }
      });
    await console.log('Event Source', this.eventSource);
  }

  listCalendarEvents() {
    let start = new Date();
    let end = new Date();
    end.setDate(start.getDate() + 31);

    this.calendar.listEventsInRange(start, end).then(events => {
      this.schedules = events;
      this.schedulesJson = JSON.stringify(this.schedules);

      this.schedules = this.schedules.filter(event => event.title.includes('KiddieCare'));
    })
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
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();

  }

  addEvent() {
    // let modal = this.modalCtrl.create(AddSchedulePage, { selectedDay: this.selectedDay });
    let modal = this.modalCtrl.create(AddSchedulePage);
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        let scheduleData = data;
        this.calendar.createEventWithOptions(scheduleData.title, scheduleData.location, scheduleData.notes, new Date(scheduleData.startDate), new Date(scheduleData.endDate), scheduleData.options)
          .then(resolve => {
            setTimeout(() => {
              this.listCalendarEvents();
              this.presentToast('Schedule added successfully!');
            });
          })
          .catch(err => this.presentToast(err));
      }
    })

    // modal.onDidDismiss(data => {
    //   if (data) {
    //     let scheduleData = data;
    //     console.log(data);

    //     scheduleData.startTime = new Date(data.startTime);
    //     scheduleData.endTime = new Date(data.endTime);

    //     console.log('Schedule Data', scheduleData);
    //     let events = this.eventSource;
    //     events.push(scheduleData);
    //     this.eventSource = []
    //     setTimeout(() => {
    //       this.storage.set('schedules', JSON.stringify(events));
    //       this.eventSource = events;
    //       this.presentToast('Successfully added schedule!')
    //       // local notification
    //       this.plt.ready().then(() => {
    //         let scheduleDate = new Date(this.schedule.startTime);
    //         this.localNotification.schedule({
    //           title: this.schedule.title,
    //           text: `${this.schedule.title}`,
    //           trigger: { at: scheduleDate, firstAt: scheduleDate },
    //           foreground: true,
    //           launch: true,
    //         });
    //       });
    //     });
    //   }
    // });
  }

  editEvent(selectedEvent) {
    let modal = this.modalCtrl.create(EditSchedulePage, { schedule: selectedEvent });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        let scheduleData = data;
        console.log(data);

        scheduleData.startTime = new Date(data.startTime);
        scheduleData.endTime = new Date(data.endTime);

        console.log('Edit Data', scheduleData);
        let events = this.eventSource;
        events = events.filter(event => event.title !== selectedEvent.title);
        events.push(scheduleData);
        this.eventSource = [];
        setTimeout(() => {
          this.storage.set('schedules', JSON.stringify(events));
          this.eventSource = events;
          this.presentToast('Successfully edited schedule!')
        });
      }
    });
  }

  deleteEvent(selectedEvent) {
    let events = this.eventSource;
    events = events.filter(event => event.title !== selectedEvent.title);
    this.eventSource = [];
    setTimeout(() => {
      this.storage.set('schedules', JSON.stringify(events));
      this.eventSource = events;
      this.presentToast('Successfully deleted schedule!');
    });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(eventData) {
    let selectedEvent = {
      title: eventData.title,
      allDay: eventData.allDay,
      startTime: eventData.startTime.toISOString(),
      endTime: eventData.endTime.toISOString()
    };

    let alert = this.alertCtrl.create({
      title: selectedEvent.title,
      subTitle: 'What do you want to do?',
      buttons: [
        {
          text: 'Update',
          handler: () => {
            this.editEvent(selectedEvent);
            alert.dismiss();
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteEvent(selectedEvent);
            alert.dismiss();
          }
        },
        {
          text: 'Nothing',
          role: 'cancel'
        }
      ]
    });
    alert.present();

    console.log('event data:', eventData)

    // let modal = this.modalCtrl.create(EditSchedulePage, { schedule: calendarData });
    // modal.present();


    // modal.onDidDismiss(data => {
    //   if (data) {
    //     console.log('DATA:', JSON.stringify(data))
    //     this.storage.set('schedule', JSON.stringify(data));
    //     // this.presentToast('Successfully updated schedule!')
    //     this.loadEvents();
    //   }
    // })

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
