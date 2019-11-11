import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-add-schedule',
  templateUrl: 'add-schedule.html',
})
export class AddSchedulePage {
  /*event = {
    title: '',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false
  }
  minDate = new Date().toISOString();

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private alertCtrl: AlertController) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSchedulePage');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    let endTime = new Date(this.event.startTime);
    endTime.setTime(endTime.getTime() + 5);
    this.event.endTime = endTime.toISOString();
    let alert = this.alertCtrl.create({
      title: 'Add Schedule?',
      subTitle: 'Add this to your schedule?',
      enableBackdropDismiss: false,
      message:
        `<p>Event: ${this.event.title}</p>
      <p>Date: ${moment(this.event.startTime).format('MMM D, YYYY')}</p>`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Agree',
          handler: () => {
            this.viewCtrl.dismiss(this.event);
          }
        }
      ]
    });
    alert.present();

  }*/

  event = { startTime: new Date().toISOString(), endTime: new Date().toISOString(), allDay: false };
  minDate = new Date().toISOString();
 
  constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }
 
  save() {
    this.viewCtrl.dismiss(this.event);
  }

}
