import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ProfileProvider } from '../../providers/profile/profile';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  profile: any;
  fullName: any;

  constructor(public navCtrl: NavController, public parentProvider: ProfileProvider, private modalCtrl: ModalController, private toastCtrl: ToastController, private storage: Storage) {
    this.loadProfile();
  }

  loadProfile() {
    this.storage.get('profile')
      .then(result => {
        this.profile = JSON.parse(result);
        console.log(this.profile);
        this.fullName = `${this.profile.first_name} ${this.profile.middle_name} ${this.profile.last_name}`;
      })
      .catch(err => console.log(err));
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  editProfile() {
    let modal = this.modalCtrl.create(EditProfilePage, { profile: this.profile });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.storage.set('profile', JSON.stringify(data));
        this.presentToast('Successfully updated profile!')
        this.loadProfile();
      }
    })
  }

}
