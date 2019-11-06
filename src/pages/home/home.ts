import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { AddChildPage } from '../add-child/add-child';
import { ViewChildPage } from '../view-child/view-child';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  children: any = [];

  constructor(public navCtrl: NavController, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private dbProvider: DatabaseProvider) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.readChildren();
      }
    })
  }

  ionViewDidLoad() {
    this.readChildren();
    this.checkJson();
  }

  checkJson(){
    this.childRecordsProvider.checkJson()
    .subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    })
    
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

  viewChild(id) {
    let modal = this.modalCtrl.create(ViewChildPage, { child_id: id });
    modal.present();
  }
}
