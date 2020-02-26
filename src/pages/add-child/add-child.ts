import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-add-child',
  templateUrl: 'add-child.html',
})
export class AddChildPage {
  child = {
    first_name: '',
    middle_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    doctor: ''
  }
  addForm: FormGroup;

  constructor(public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider, private fb: FormBuilder, private viewCtrl: ViewController, private toastCtrl: ToastController) {
    this.addForm = this.fb.group({
      first_name: ['Please enter your firstname', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      middle_name: [''],
      last_name: ['Please enter your lastname', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
      doctor: ['']
    });
  }

  get f() { return this.addForm.controls; }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  addChild() {
    if (this.addForm.invalid) {
      this.presentToast('Please fill out all required fields correctly!');
      return;
    }
    this.viewCtrl.dismiss(this.child);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}