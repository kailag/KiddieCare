import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';

@IonicPage()
@Component({
  selector: 'page-view-child',
  templateUrl: 'view-child.html',
})
export class ViewChildPage {
  childId: any;
  child = { first_name: '', middle_name: '', last_name: '', birth_date: '' }

  constructor(public navCtrl: NavController, public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider) {
    this.childId = this.navParams.get('id');
    this.readChild();
  }

  readChild() {
    this.childRecordsProvider.readChild(this.childId)
      .then(data => {
        if (data.rows.length > 0) {
          this.child.first_name = data.rows.item[0].first_name;
          this.child.middle_name = data.rows.item[0].middle_name;
          this.child.last_name = data.rows.item[0].last_name;
          this.child.birth_date = data.rows.item[0].birth_date;
        }
      })
      .catch(e => console.log(e));
  }

}
