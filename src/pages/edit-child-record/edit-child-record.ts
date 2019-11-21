import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-edit-child-record',
  templateUrl: 'edit-child-record.html',
})
export class EditChildRecordPage {

  editForm: FormGroup;
  record: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private fb: FormBuilder) {
    this.record = this.navParams.get('record');
    this.editForm = this.fb.group({
      consultation_type: ['', Validators.required], 
      consultation_prescription: ['', Validators.required],
      consultation_instructions: ['', Validators.required], 
      consultation_findings: ['', Validators.required], 
      consultation_doctor: ['', Validators.required], 
      consultation_date_of_visit: ['', Validators.required],     
      consultation_date_of_next_visit: ['', Validators.required],
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  get f() { return this.editForm.controls }

  updateChildRecord(){
    if (this.editForm.invalid) {
      return;
    }
    let updateData = this.record;
    this.viewCtrl.dismiss(updateData);
  }

}
