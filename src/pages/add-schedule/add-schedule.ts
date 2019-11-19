import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-add-schedule',
  templateUrl: 'add-schedule.html',
})
export class AddSchedulePage {
  isNotify = false;
  children: any;
  selectedChild: any;

  event = { startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false };
  minDate = new Date().toISOString();

  schedule = {
    title: '',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false,
  }

  constructor(public localNotification: LocalNotifications, public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController, private childRecordsProvider: ChildRecordsProvider, private fb: FormBuilder) {

    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.schedule.startTime = preselectedDate;
    this.schedule.endTime = preselectedDate;
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  addSchedule() {
    if (this.isNotify === true) {
      let scheduleDate = new Date(this.schedule.startTime);
      this.localNotification.schedule({
        title: this.schedule.title,
        text: `${this.selectedChild}'s ${this.schedule.title}`,
        trigger: { at: scheduleDate, firstAt: scheduleDate },
        foreground: true,
        launch: true,
      });
    }
    let endTime = new Date(this.schedule.startTime);
    endTime.setTime(endTime.getTime() + 1)
    this.schedule.endTime = endTime.toISOString();
    this.viewCtrl.dismiss(this.schedule);
  }

  readChildren() {
    this.childRecordsProvider.readChildren()
      .then(data => {
        this.children = data;
      })
      .catch(err => {
        console.log(err);
      });
  }



}
