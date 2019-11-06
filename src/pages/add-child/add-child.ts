import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
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
    birth_date: ''
  }
  addForm: FormGroup;

  constructor(private navCtrl: NavController, public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider, private fb: FormBuilder, private viewCtrl: ViewController, private alertCtrl: AlertController) {
    this.addForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: ['', Validators.required],
      last_name: ['', Validators.required],
      birth_date: ['', Validators.required]
    });
  }

  get f() { return this.addForm.controls; }

  addChild() {
    if (this.addForm.invalid) {
      return;
    }

    let alert = this.alertCtrl.create({
      title: 'Add Child',
      subTitle: 'Continue adding child?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            this.viewCtrl.dismiss(this.child);
          }
        }
      ]
    });
    alert.present();
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

}
