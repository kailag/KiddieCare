import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController } from 'ionic-angular';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { AddChildRecordPage } from '../add-child-record/add-child-record';
import { ConsultationProvider } from '../../providers/consultation/consultation';
import { DatabaseProvider } from '../../providers/database/database';
import { EditChildRecordPage } from '../edit-child-record/edit-child-record';


@IonicPage()
@Component({
  selector: 'page-view-child',
  templateUrl: 'view-child.html',
})
export class ViewChildPage {

  child: any;
  records: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private consultationProvider: ConsultationProvider, private toastCtrl: ToastController, private alertCtrl: AlertController, private dbProvider: DatabaseProvider) {
    
    this.child = this.navParams.get('child');
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.readChildRecords();
      }
    });

    // this.test();
  }

  test(){
    let alert = this.alertCtrl.create({
      title: 'Yo!',
      subTitle: 'Child ID: ' + this.child.child_id,
      buttons: ['OK']
    });
    alert.present();
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
      .then(data => {
        this.records = data;
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

  editRecord(record){
    let modal = this.modalCtrl.create(EditChildRecordPage, { record: record });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.consultationProvider.updateChildRecord(data)
          .then(res => {
            this.readChildRecords();
            this.presentToast('Successfully updated child record!')
          })
          .catch(e => console.log(e));
      }
    })
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