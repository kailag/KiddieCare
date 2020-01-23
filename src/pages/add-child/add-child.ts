import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
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

  constructor(private navCtrl: NavController, public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider, private fb: FormBuilder, private viewCtrl: ViewController, private toastCtrl: ToastController) {
    this.addForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required]
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
      this.presentToast('Please fill out all required fields!');
      return;
    }
    this.viewCtrl.dismiss(this.child);
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

}