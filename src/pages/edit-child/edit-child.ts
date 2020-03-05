import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-child',
  templateUrl: 'edit-child.html',
})
export class EditChildPage {

  editForm: FormGroup;
  child: any

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private fb: FormBuilder, private toastCtrl: ToastController) {
    this.child = this.navParams.get('child');
    this.editForm = this.fb.group({
      first_name: ['Please enter your firstname', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      middle_name: [''],
      last_name: ['Please enter your firstname', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      doctor: ['']
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

  updateChild() {
    if (this.editForm.invalid) {
      this.presentToast('Please fill out all required fields correctly!');
      return;
    }
    let updateData = this.child;
    this.viewCtrl.dismiss(updateData);
  }

}
