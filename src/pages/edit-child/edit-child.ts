import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-child',
  templateUrl: 'edit-child.html',
})
export class EditChildPage {

  editForm: FormGroup;
  child: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private fb: FormBuilder) {
    this.child = this.navParams.get('child');
    this.editForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      doctor: ['']
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  get f() { return this.editForm.controls }

  updateChild() {
    if (this.editForm.invalid) {
      return;
    }
    let updateData = this.child;
    this.viewCtrl.dismiss(updateData);
  }

}
