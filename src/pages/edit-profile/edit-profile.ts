import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController} from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  editForm: FormGroup;
  profile: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private fb: FormBuilder, public toastCtrl: ToastController) {
    this.profile = this.navParams.get('profile');
    this.editForm = this.fb.group({
      first_name: ['Please enter your firstname', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      middle_name: [''],
      last_name: ['Please enter your lastname', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  get f() { return this.editForm.controls }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  updateProfile() {
    if (this.editForm.invalid) {
      this.presentToast('Please fill out all required fields correctly!');
      return;
    }
    let updateData = this.profile;
    this.viewCtrl.dismiss(updateData);
  }

}
