import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-add-schedule',
  templateUrl: 'add-schedule.html',
})
export class AddSchedulePage {

  schedule = {
    title: '',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    notes: '',
    location: '',
    options: { firstReminderMinutes: 15, secondReminderMinutes: 5, id: 'childRecord' }
  }

  event = {
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false
  };

  children: any;
  selectedChild: any;

  addForm: FormGroup;
  addScheduleForm: FormGroup;

  constructor(public navParams: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, private fb: FormBuilder, ) {
    // let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    // this.event.startTime = preselectedDate;
    // this.event.endTime = preselectedDate;

    // this.addForm = this.fb.group({
    //   title: ['', Validators.required],
    //   startTime: ['', Validators.required],
    //   endTime: ['', Validators.required],
    //   allDay: ['', Validators.required]
    // });

    this.addScheduleForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      notes: ['', Validators.required],
      location: ['']
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  // get f() { return this.addForm.controls }
  get f() { return this.addScheduleForm.controls };

  save() {
    if (this.addScheduleForm.invalid) {
      return;
    }
    // this.viewCtrl.dismiss(this.event);
    this.schedule.title = `KiddieCare-${this.schedule.title}`;
    this.viewCtrl.dismiss(this.schedule);
  }

}
