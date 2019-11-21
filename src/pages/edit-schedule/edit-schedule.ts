import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-schedule',
  templateUrl: 'edit-schedule.html',
})
export class EditSchedulePage {

  schedule: any;
  editForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private fb: FormBuilder) {
    this.schedule = this.navParams.get('schedule');
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      allDay: ['', Validators.required]
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  get f() { return this.editForm.controls }

  updateSchedule(){
    if (this.editForm.invalid) {
      return;
    }
    let updateData = this.schedule;
    this.viewCtrl.dismiss(updateData);
  }

}
