import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { ConsultationProvider } from '../../providers/consultation/consultation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-add-child-record',
  templateUrl: 'add-child-record.html',
})
export class AddChildRecordPage {
  consultation = {
    consultation_type: '',
    consultation_description: '',
    consultation_date: '',
    consultation_location: ''
  }
  addForm: FormGroup;

  constructor(private navCtrl: NavController, public navParams: NavParams, public consultationProvider: ConsultationProvider, private fb: FormBuilder, private viewCtrl: ViewController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.addForm = this.fb.group({
      id: ['', Validators.required],
      consultation_type: ['', Validators.required],
      consultation_description: ['', Validators.required],
      consultation_date: ['', Validators.required],
      consultation_location: ['', Validators.required]
    });
  }

  get f() { return this.addForm.controls; }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddChildRecordPage');
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  addChildRecord(){

    if (this.addForm.invalid) {
      this.presentToast('Please fill out all required fields!');
      return;
    }
  }
  
  cancel(){
    this.viewCtrl.dismiss();
  }

}