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
    startDate: '',
    endDate: new Date(),
    notes: '',
    location: '',
    options: { firstReminderMinutes: 15, secondReminderMinutes: 5, id: 'childRecord' }
  }
  minDate = new Date().getFullYear();
  maxDate = new Date().getFullYear() + 10;

  children: any;
  selectedChild: any;

  addForm: FormGroup;
  addScheduleForm: FormGroup;

  constructor(public navParams: NavParams, public navCtrl: NavController, public viewCtrl: ViewController, private fb: FormBuilder, ) {

    this.addScheduleForm = this.fb.group({
      title: ['', Validators.required],
      startDate: ['', Validators.required],
      notes: ['', Validators.required],
      location: ['']
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  get f() { return this.addScheduleForm.controls };

  save() {
    if (this.addScheduleForm.invalid) {
      return;
    }
    let start = new Date(this.schedule.startDate);
    let end = new Date();
    end.setDate(start.getDate());
    end.setHours(start.getHours())
    this.schedule.endDate = end;
    this.schedule.title = `KiddieCare-${this.schedule.title}`;
    console.log(this.schedule);
    this.viewCtrl.dismiss(this.schedule);
  }

}
