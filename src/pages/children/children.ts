import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { AddChildPage } from '../add-child/add-child';
import { ViewChildPage } from '../view-child/view-child';
import { EditChildPage } from '../edit-child/edit-child';
import moment from 'moment';

@Component({
  selector: 'page-children',
  templateUrl: 'children.html'
})
export class ChildrenPage {
  children: any = [];
  photo: any;

  constructor(public navCtrl: NavController, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private dbProvider: DatabaseProvider, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.readChildren();
      }
    })
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  readChildren() {
    this.childRecordsProvider.readChildren()
      .then(data => {
        this.children = data;
      })
      .catch(err => console.log(err));
  }

  addChild() {
    let modal = this.modalCtrl.create(AddChildPage);
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.childRecordsProvider.addChild(data)
          .then(res => {

            this.readChildren();
            this.presentToast('Successfully added child profile!');

          }).catch(err => {
            console.log(err);
          })
      }
    });
  }

  viewChild(child) {
    this.navCtrl.push(ViewChildPage, {child: child});
  }

  editChild(child) {
    let modal = this.modalCtrl.create(EditChildPage, { child: child });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.childRecordsProvider.updateChild(data)
          .then(res => {
            this.readChildren();
            this.presentToast('Successfully updated child profile!')
          })
          .catch(e => console.log(e));
      }
    })
  }

  deleteChild(id: any) {
    let alert = this.alertCtrl.create({
      title: 'WARNING!',
      subTitle: 'Are you sure you want to delete this child profile?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            this.childRecordsProvider.deleteChild(id)
              .then(res => {
                this.readChildren();
                this.presentToast('Successfully deleted child profile!');
              })
              .catch(e => console.log(e));
          }
        }
      ]
    });
    alert.present();
  }

  returnAge(birthdate) {
    let today = moment();
    let birthday = moment(birthdate);
    let years = today.diff(birthday, 'year');
    birthday.add(years, 'years');
    let months = today.diff(birthday, 'months');
    birthday.add(months, 'months');
    return `${years} years, ${months} months`;
  }


}

