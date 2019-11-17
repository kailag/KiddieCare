import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, Toast } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ProfileProvider } from '../../providers/profile/profile';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  parent: any = [];

  constructor(public navCtrl: NavController, public parentProvider: ProfileProvider, private modalCtrl: ModalController, private dbProvider: DatabaseProvider, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.readParent();
      }
    })
  }

  ionViewDidLoad() {
    this.readParent();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  readParent(){
    this.parentProvider.readAllParent()
      .then(data => {
        this.parent = data;
      })
      .catch(err => console.log(err));
  }

  editProfile(parent) {
    let modal = this.modalCtrl.create(EditProfilePage, { parent: parent });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.parentProvider.updateProfile(data)
          .then(res => {

            this.readParent();
            this.presentToast('Profile updated successfully!')
          })
          .catch(e => console.log(e));
      }
    })
  }

}
