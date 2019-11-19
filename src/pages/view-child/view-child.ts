import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController } from 'ionic-angular';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { AddChildRecordPage } from '../add-child-record/add-child-record';
import { ConsultationProvider } from '../../providers/consultation/consultation';

@IonicPage()
@Component({
  selector: 'page-view-child',
  templateUrl: 'view-child.html',
})
export class ViewChildPage {

  child: any;
  records: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private consultationProvider: ConsultationProvider, private toastCtrl: ToastController, private alertCtrl: AlertController) {
    this.child = navParams.data.child;
  }

  ionViewDidLoad() {
    this.readChildRecords();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  readChildRecords() {
    this.consultationProvider.readChildRecords(this.child.child_id)
      .then(res => {
        this.records = res;
      })
      .catch(e => console.log(e));
  }

  addChildRecord() {
    let modal = this.modalCtrl.create(AddChildRecordPage);
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let newRecord = data;
        newRecord.child_id = this.child.child_id;
        console.log(newRecord);
        this.consultationProvider.addChildRecord(newRecord)
          .then(res => {
            this.readChildRecords();
            this.presentToast('Record successfully added!');
          })
          .catch(e => console.log(e));
      }
    });
  }

  deleteRecord(id) {
    let alert = this.alertCtrl.create({
      title: 'WARNING!',
      subTitle: 'Are you sure you want to delete this record?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            this.consultationProvider.deleteChildRecord(id)
              .then(res => {
                console.log(res);
                this.readChildRecords();
              })
              .catch(e => console.log(e));
          }
        }
      ]
    });
    alert.present();
  }

}