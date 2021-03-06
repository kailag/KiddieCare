import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  editForm: FormGroup;
  profile: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private fb: FormBuilder) {
    this.profile = this.navParams.get('profile');
    this.editForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: ['', Validators.required],
      last_name: ['', Validators.required]
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  get f() { return this.editForm.controls }

  updateProfile() {
    if (this.editForm.invalid) {
      return;
    }
    let updateData = this.profile;
    this.viewCtrl.dismiss(updateData);
  }

}
