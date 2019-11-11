import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { AddChildRecordPage } from '../add-child-record/add-child-record';

@IonicPage()
@Component({
  selector: 'page-view-child',
  templateUrl: 'view-child.html',
})
export class ViewChildPage {
  
  child;

  constructor(public navCtrl: NavController, public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController) {
    this.child = navParams.data.child;
  }

  addChildRecord(){
    let modal = this.modalCtrl.create(AddChildRecordPage);
    modal.present();
  }

}