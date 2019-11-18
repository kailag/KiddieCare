import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  parent = {
    first_name: '',
    middle_name: '',
    last_name: ''
  }
  addForm: FormGroup;

  constructor(private navCtrl: NavController, public navParams: NavParams, public profileProvider: ProfileProvider, private fb: FormBuilder, private viewCtrl: ViewController, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.addForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: ['', Validators.required],
      last_name: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  addProfile(){
    if (this.addForm.invalid) {
      this.presentToast('Please fill out all required fields!');
      return;
    }
    
  }

}
