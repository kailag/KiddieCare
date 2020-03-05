import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';

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
  createProfileForm: FormGroup;

  constructor(private navCtrl: NavController, public navParams: NavParams, public profileProvider: ProfileProvider, private fb: FormBuilder, private alertCtrl: AlertController, private toastCtrl: ToastController, private storage: Storage) {
    this.createProfileForm = this.fb.group({
      first_name: ['Please enter your firstname', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      middle_name: [''],
      last_name: ['Please enter your lastname', Validators.compose([Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    });
  }

  ionViewDidLoad() {
    this.presentAlert();
  }

  get f() { return this.createProfileForm.controls; }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  addProfile() {
    if (this.createProfileForm.invalid) {
      this.presentToast('Please fill out all required fields correctly!');
      return;
    }
    console.log(this.createProfileForm.value);
    this.storage.set('profile', JSON.stringify(this.parent));
    this.storage.set('welcome', true);
    this.presentToast('Profile Created successfully!');
    this.navCtrl.setRoot(TabsPage);
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Welcome to KiddieCare!',
      subTitle: 'Please set up your profile to continue using the app. All fields with an asterisk (*) are required.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Continue',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

}
