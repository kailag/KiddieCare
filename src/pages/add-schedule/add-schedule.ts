import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import randomstring from 'randomstring';

@IonicPage()
@Component({
  selector: 'page-add-schedule',
  templateUrl: 'add-schedule.html',
})
export class AddSchedulePage {

  
  event = { 
    startTime: new Date().toISOString(), 
    endTime: new Date().toISOString(), 
    allDay: false
  };

  minDate = new Date().toISOString();
  children: any;
  selectedChild: any;

  addForm: FormGroup;
 
  constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController,  private fb: FormBuilder, private dbProvider: DatabaseProvider, private childRecordsProvider: ChildRecordsProvider) {
    
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
    
    this.addForm = this.fb.group({
      title: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      allDay: ['', Validators.required]
    });
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }

  get f() { return this.addForm.controls }
 
  save() {
    this.viewCtrl.dismiss(this.event);
  }

}
