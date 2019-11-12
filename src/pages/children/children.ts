import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController, Toast } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { AddChildPage } from '../add-child/add-child';
import { ViewChildPage } from '../view-child/view-child';
import { EditChildPage } from '../edit-child/edit-child';

@Component({
  selector: 'page-children',
  templateUrl: 'children.html'
})
export class ChildrenPage {
  children: any = [];

  constructor(public navCtrl: NavController, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private dbProvider: DatabaseProvider, private alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.readChildren();
      }
    })
  }

  ionViewDidLoad() {
    this.readChildren();
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
            this.presentToast('Child was added successfully!');

          }).catch(err => {
            console.log(err);
          })
      }
    });
  }

  viewChild(child) {
    /*let modal = this.modalCtrl.create(ViewChildPage, { child_id: id });
    modal.present();*/

    this.navCtrl.push(ViewChildPage, { child: child });
  }

  editChild(child) {
    let modal = this.modalCtrl.create(EditChildPage, { child: child });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.childRecordsProvider.updateChild(data)
          .then(res => {

            this.readChildren();
            this.presentToast('Child updated successfully!')
          })
          .catch(e => console.log(e));
      }
    })
  }

  deleteChild(id: any) {

    //alert
    let alert = this.alertCtrl.create({
      title: 'WARNING!',
      subTitle: 'Are you sure you want to delete this child?',
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
                this.presentToast('Child deleted successfully!');
              })
              .catch(e => console.log(e));
          }
        }
      ]
    });
    alert.present();
  }
}