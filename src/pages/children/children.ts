import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private dbProvider: DatabaseProvider, private alertCtrl: AlertController) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.readChildren();
      }
    })
  }

  ionViewDidLoad() {
    this.readChildren();
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
        console.log(data);
        this.childRecordsProvider.addChild(data)
          .then(res => {
            console.log(res);
            this.readChildren();
          }).catch(err => {
            console.log(err);
          })
      }
    });
  }

  viewChild(child) {
    /*let modal = this.modalCtrl.create(ViewChildPage, { child_id: id });
    modal.present();*/

    this.navCtrl.push(ViewChildPage, {
      child:child
    });
  }

  editChild(child){
    let modal = this.modalCtrl.create(EditChildPage, { child:child });
    modal.present();
  }

  deleteChild(id:any){    

    //alert
    let alert = this.alertCtrl.create({
      title: 'WARNING!',
      subTitle: 'Are you sure you want to delete this child?' + id,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {

          }
        }
      ]
    });
    alert.present();
  }
}